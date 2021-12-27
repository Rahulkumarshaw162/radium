const productModel = require('../models/ProductModel')
const validator = require('../validation/validator')
const config = require('../Aws/Aws')

const createProduct = async function (req, res) {
    try {
        let requestProduct = req.body
        let files = req.files;
        let { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments, deletedAt, isDeleted } = requestProduct

        // validation start
        if (!validator.isValid(requestProduct)) {
            return res.status(400).send({ status: false, message: "requestProduct is required" })
        }
        if (!validator.isValid(files)) {
            return res.status(400).send({ status: false, message: "files is required" })
        }
        if (!validator.isValidRequestBody(requestProduct)) {
            return res.status(400).send({ status: false, message: "please provide valid request body" })
        }
        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, message: "title is required" })
        }
        if (!validator.isValid(description)) {
            return res.status(400).send({ status: false, message: "description is required" })
        }
        if (!validator.isValid(price)) {
            return res.status(400).send({ status: false, message: "price is required" })
        }
        if (!validator.isValid(currencyId)) {
            return res.status(400).send({ status: false, message: "currencyId is required" })
        }
        if (!validator.isValid(currencyFormat)) {
            return res.status(400).send({ status: false, message: "currencyFormate is required" })
        }
        if (!validator.isValidAvailableSizes(availableSizes)) {
            return res.status(400).send({ status: false, message: "at least one availableSizes is required" })
        }
        if (!validator.validPrice(price)) {
            return res.status(400).send({ status: false, message: "price  is in number and decimal required" })
        }
        if (!validator.validCurrencyId(currencyId)) {
            return res.status(400).send({ status: false, message: "price  IN CURRENCYiD required" })
        }
        if (!validator.validCurrencyFormat(currencyFormat)) {
            return res.status(400).send({ status: false, message: "validCurrencyFormat is required" })
        }
        productImage = await config.uploadFile(files[0]);
        if (!validator.isValid(productImage)) {
            return res.status(400).send({ status: false, message: "productImage is required" })
        }
        // validation end
        // validation for uniqness
        const isTitleAleadyUsed = await productModel.findOne({ title })
        if (isTitleAleadyUsed) {
            return res.status(400).send({ status: false, message: "title is already in use, try something different" })
        }
        let productData = { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments, deletedAt, isDeleted }
        const Product = await productModel.create(productData)
        res.status(200).send({ status: true, message: 'product succesfully created ', data: Product, })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}
// GET /products

// 3rd api GET /products/:productId

const productById = async function (req, res) {
    try {
        let requestProductId = req.params.productId
        // request  params  validation
        // if (!validator.isValidObjectId(requestProductId)) {
        //     return res.status(400).send({ status: false, message: `${requestProductId} is not a valid product id` })
        // }
        // if (!(requestProductId)) {
        //     res.status(404).send({
        //         status: false,
        //         msg: "plz provide valid product's Id"
        //     })
        // }

        let productData = await productModel.findById({ _id: requestProductId })
        if (!productData) {
            return res.status(404).send({ status: false, msg: 'product not found for the requested productId' })
        } else {
            return res.status(200).send({ status: true, message: "all requested Product list", data: productData })
        }
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}
// PUT /products/:productId

// DELETE /products/:productId

module.exports = { createProduct, productById }