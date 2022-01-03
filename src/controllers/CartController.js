//const mongoose = require('mongoose')
const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')
const userModel = require('../models/userModel')
const validator = require('../validation/validator')
const middleware = require('../middleware/loginmiddle')


const createCart = async function(req, res) {
    try {
        const userId = req.params.userId
        const requestBody = req.body;
        const userIdFromToken = req.userId

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid params received in request body' })
        }

        const { cartId, productId } = requestBody

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
        }

        const user = await userModel.findOne({ _id: userId, isDeleted: false });

        if (!user) {
            return res.status(404).send({ status: false, message: `user does not exit` })
        }

        if (!validator.isValid(productId)) {
            return res.status(400).send({ status: false, message: 'productId is required' })
        }

        if (!validator.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: `${productId} is not a valid productId id` })
        }

        const product = await productModel.findOne({ _id: productId, isDeleted: false }).select('_id title price productImage')

        if (!product) {
            return res.status(404).send({ status: false, message: `product does not exit` })
        }

        if (!cartId) {

            const cart = await cartModel.findOne({ userId: userId });

            if (cart) {
                return res.status(400).send({ status: false, message: `this user already has a cart` })
            }

            const addToCart = {
                userId: userId,
                items: [{
                    productId: productId,
                    quantity: 1
                }],
                totalPrice: product.price,
                totalItems: 1
            }

            const cartCreate = await cartModel.create(addToCart)

            cartCreate['items'][0]['productId'] = product

            res.status(201).send({ status: true, message: "success", data: cartCreate })
        }

        if (!validator.isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, message: `${cartId} is not a valid cartId id` })
        }


        const cart = await cartModel.findOne({ userId: userId });

        if (cart) {

            //don't need to fetch cart again. COmpare userId in cart and userId in path param to see ifcRT BELONGS TO THE USER
            const cartNotFound = await cartModel.findOne({ _id: cartId, userId: userId });

            if (!cartNotFound) {
                return res.status(404).send({ status: false, message: `cart does not exit` })
            }


            const isItemAdded = cart.items.find(c => c['productId'] == productId)

            if (isItemAdded) {

                const updatedCartReplaceData = {}

                if (!Object.prototype.hasOwnProperty.call(updatedCartReplaceData, '$pull'))
                    updatedCartReplaceData['$pull'] = {}

                updatedCartReplaceData['$pull']['items'] = { 'productId': productId, 'quantity': isItemAdded.quantity }

                const cartReplace = await cartModel.findOneAndUpdate({ _id: cartId }, updatedCartReplaceData, { new: true })

                const updatedCartData = {}

                if (!Object.prototype.hasOwnProperty.call(updatedCartData, '$addToSet'))
                    updatedCartData['$addToSet'] = {}

                updatedCartData['$addToSet']['items'] = { 'productId': productId, 'quantity': isItemAdded.quantity + 1 }


                if (!Object.prototype.hasOwnProperty.call(updatedCartData, '$set'))
                    updatedCartData['$set'] = {}

                updatedCartData['$set']['totalPrice'] = cart.totalPrice + product.price


                if (!Object.prototype.hasOwnProperty.call(updatedCartData, '$set'))
                    updatedCartData['$set'] = {}

                updatedCartData['$set']['totalItems'] = cart.items.length

                const cartUpToDate = await cartModel.findOneAndUpdate({ _id: cartId }, updatedCartData, { new: true }).populate('items.productId', { _id: 1, title: 1, price: 1, productImage: 1 })

                return res.status(201).send({ status: false, message: "success", data: cartUpToDate })
            }

            const updatedCartData = {}

            if (!Object.prototype.hasOwnProperty.call(updatedCartData, '$addToSet'))
                updatedCartData['$addToSet'] = {}

            updatedCartData['$addToSet']['items'] = { $each: [{ productId: productId, quantity: 1 }] }



            if (!Object.prototype.hasOwnProperty.call(updatedCartData, '$set'))
                updatedCartData['$set'] = {}

            updatedCartData['$set']['totalPrice'] = cart.totalPrice + product.price



            if (!Object.prototype.hasOwnProperty.call(updatedCartData, '$set'))
                updatedCartData['$set'] = {}

            updatedCartData['$set']['totalItems'] = cart.items.length + 1


            const cartUpdate = await cartModel.findOneAndUpdate({ _id: cartId }, updatedCartData, { new: true }).populate('items.productId', { _id: 1, title: 1, price: 1, productImage: 1 })

            return res.status(201).send({ status: false, message: "success", data: cartUpdate })

        }

        const addToCart = {
            userId: userId,
            items: [{
                productId: productId,
                quantity: 1
            }],
            totalPrice: product.price,
            totalItems: 1
        }

        const cartCreate = await cartModel.create(addToCart)

        cartCreate['items'][0]['productId'] = product

        res.status(201).send({ status: true, message: "success", data: cartCreate })

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, data: error.message });
    }
}



const updateCart = async function(req, res) {
    try {
        const userId = req.params.userId
        const userIdFromToken = req.userId

        if (!validator.isValidObjectId(userIdFromToken)) {
            return res.status(400).send({ status: false, message: `${userIdFromToken} Invalid user id ` })
        }
        if (!validator.isValidObjectId(userId)) {
            res.status(400).send({ status: false, msg: "Invalid user id" })
        }
        const user = await userModel.findById({ _id: userId })
        if (!user) {
            res.status(400).send({ status: false, msg: "user not found" })
        }
        if (userId.toString() !== userIdFromToken) {
            res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
            return
        }
        //authentication required
        const requestBody = req.body
        let { productId, removeProduct, cartId } = requestBody
        const findCart = await cartModel.findOne({ _id: cartId })
        if (!findCart) {
            return res.status(400).send({ status: false, message: `cart does not exist` })
        }

        const product = await productModel.findOne({ _id: req.body.productId, isDeleted: false })

        if (removeProduct == 1) {
            //const totalItems1=findCart.totalItems-1
            for (let i = 0; i < findCart.items.length; i++) {
                if (findCart.items[i].productId == productId) {
                    //remove that productId from items array
                    const updatedPrice = findCart.totalPrice - product.price
                    findCart.items[i].quantity = findCart.items[i].quantity - 1
                    if (findCart.items[i].quantity > 0) {
                        console.log("Hi")
                        const response = await cartModel.findOneAndUpdate({ _id: cartId }, { items: findCart.items, totalPrice: updatedPrice }, { new: true })
                        return res.status(201).send({ status: true, message: `One quantity  removed from the product cart successfully`, data: response })
                    } else {

                        const totalItems1 = findCart.totalItems - 1
                        findCart.items.splice(i, 1)


                        const response = await cartModel.findOneAndUpdate({ _id: cartId }, { items: findCart.items, totalItems: totalItems1, totalPrice: updatedPrice }, { new: true })
                        return res.status(201).send({ status: true, message: `1 product removed from the cart successfully`, data: response })

                    }
                }

            }
        }
        if (removeProduct == 0) {
            for (let i = 0; i < findCart.items.length; i++) {
                if (findCart.items[i].productId == productId) {
                    const updatedPrice = findCart.totalPrice - (product.price * findCart.items[i].quantity)
                    const totalItems1 = findCart.totalItems - 1
                        //remove that productId from items array
                    findCart.items.splice(i, 1)
                    const response = await cartModel.findOneAndUpdate({ _id: cartId }, { items: findCart.items, totalItems: totalItems1, totalPrice: updatedPrice }, { new: true })
                    return res.status(201).send({ status: true, message: ` product removed from the cart successfully`, data: response })

                }
            }
        }
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}


const getCart = async(req, res) => {
    try {
        const userId = req.params.userId
        let tokenId = req.userId

        if (!(validator.isValidObjectId(userId) && validator.isValidObjectId(tokenId))) {
            return res.status(400).send({ status: false, message: "userId or token is not valid" });;
        }
        if (!(userId.toString() == tokenId.toString())) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }
        const checkUser = await cartModel.findOne({ userId: userId })
        if (!checkUser) {
            return res.status(404).send({ status: false, msg: "There is no cart exist with this user id" });
        }

        return res.status(200).send({ status: true, message: 'User cart details', data: checkUser });
    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: err.message });
    }
}


const deleteCart = async(req, res) => {
    try {
        const userId = req.params.userId
        let tokenId = req.userId
        if (!(validator.isValidObjectId(userId) && validator.isValidObjectId(tokenId))) {
            return res.status(400).send({ status: false, message: "userId or token is not valid" });;
        }
        if (!(userId.toString() == tokenId.toString())) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }
        const checkCart = await cartModel.findOne({ userId: userId })
        if (!checkCart) {
            return res.status(404).send({ status: false, msg: "Cart doesn't exist" })
        }
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).send({ status: false, msg: "user doesn't exist" })
        }
        const deleteCart = await cartModel.findOneAndUpdate({ userId: userId }, { items: [], totalPrice: 0, totalItems: 0 }, { new: true })
        res.status(200).send({ status: true, msg: "Successfully deleted", data: deleteCart })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: err.message });
    }


}


module.exports = { createCart, deleteCart, updateCart, getCart }