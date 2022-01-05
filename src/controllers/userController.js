const userModel = require('../models/userModel')
const validator = require('../utils/validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10

///////////////////////////user///////////////////////
const createUser = async function (req, res) {
    try {
        let requestBody = req.body
        let { fname, lname, email, phone, password } = requestBody

        // validation start
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "please provide valid request body" })
        }
        if (!validator.isValid(fname) || !validator.isValid(lname)) {
            return res.status(400).send({ status: false, message: "first name or last name is missing" })
        }
        if (!validator.validateEmail(email) || !validator.isValid(email)) {
            return res.status(400).send({ status: false, message: `email not present or  Please enter a valid email address` })
        }
        let isEmail = await userModel.findOne({ email: requestBody.email })

        if (isEmail) {
            return res.status(400).send({ status: false, message: `Email Already Present` });
        }
        if (phone) {
            if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone)) {
                return res.status(400).send({ status: false, message: ` something went wrong. Please enter a valid Indian phone number.` });
            }
            let isPhone = await userModel.findOne({ phone: phone })
            if (isPhone) {
                return res.status(400).send({ status: false, message: ` ${phone} allready registered.` });
            }
        }
        if (!validator.isValidLength(password, 8, 15) || !validator.isValid(password)) {
            return res.status(400).send({ status: false, message: `password not pressent or provided Password not  between 8 to 15 char long` })
        }
        // validation end
        const encryptPass = await bcrypt.hash(password, 10)
        userData = {
            fname,
            lname,
            email,
            phone,
            password: encryptPass
        }
        const user = await userModel.create(userData);
        return res.status(201).send({ status: true, message: "user created successfully.", data: user });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error is : " + err })
    }
}
//////////////////////////// Login ////////////////////////////////////

const userLogin = async function (req, res) {
    try {
        const requestBody = req.body;

        const { email, password } = requestBody;
        // validation start
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request, Please provide login details' })
        }
        if (!validator.isValid(requestBody.email) || !validator.validateEmail(email)) {
            return res.status(400).send({ status: false, message: 'email not exist or Please provide a valid email address' })
        }
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: 'Password is required' })
        }
        // Validation ends
        const user = await userModel.findOne({ email: email });
        console.log(user)
        if (!user) {
            return res.status(401).send({ status: false, message: `email not find ` });
        }
        const encryptPass = await bcrypt.compare(password, user.password)
        if (!user || !encryptPass) {
            return res.status(401).send({ status: false, message: `Invalid login password ` });
        }
        const userId = user._id
        const token = await jwt.sign({
            userId: userId,
            iat: Math.floor(Date.now() / 1000),  // inital time
            exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 7 // expiry time.
        }, 'RahulQura')
        return res.status(200).send({ status: true, message: `user login successfully `, data: { userId, token } })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message });
    }
}
//////////////////////////////// get user ////////////
const getUser = async function (req, res) {
    try {
        const userId = req.params.userId
        const userIdToken = req.userId

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid userId in params." })
        }
        // if (!validator.isValid(userId)){
        //     return res.status(400).send({ status: false, message: " pls provide userId in params." })
        // }
        const isUser = await userModel.findOne({ _id: userId })
        if (!isUser) {
            return res.status(400).send({ status: false, message: `${userId} doesn't exists ` })
        }

        if (userIdToken != isUser._id) {
            return res.status(401).send({ status: false, message: "Unauthorized access." })
        }
        return res.status(200).send({ status: true, message: "Profile found successfully.", data: isUser })
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: "Error is: " + err.message
        })
    }
}
// /////////////////////////////////////// update user /////////////

const updateUser = async function (req, res) {
    try {
        let requestBody = req.body
        let userId = req.params.userId
        let userIdToken = req.userId

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request, Please provide login details' })
        }
        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
        }
        if (!validator.isValidObjectId(userIdToken)) {
            return res.status(400).send({ status: false, message: `Unauthorized access! User's info doesn't match ` })
        }
        const isUser = await userModel.findOne({ _id: userId })
        if (!isUser) {
            return res.status(400).send({ status: false, message: ` ${userId} not exist` })
        }
        if (isUser._id.toString() != userIdToken) {
            res.status(401).send({ status: false, message: `Unauthorized access!` });
            return
        }
        // Extract params
        let { fname, lname, email, phone, password } = requestBody;

        if (!validator.validString(fname) || !validator.validString(lname)) {
            return res.status(400).send({ status: false, message: 'first name or last name is Required' })
        }
        if (email) {
            if (!validator.validString(email) || !validator.validateEmail(email)) {
                return res.status(400).send({ status: false, message: 'Please provide a valid email address' })
            }
            let isEmail = await userModel.findOne({ email: email })
            if (isEmail) {
                return res.status(400).send({ status: false, message: ` email already registered, try onother` });
            }
        }
        if (!validator.validString(phone)) {
            return res.status(400).send({ status: false, message: 'phone number is Required' })
        }

        if (phone) {
            if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone)) {
                return res.status(400).send({ status: false, message: `Please enter a valid Indian phone number.` });
            }
            let isPhone = await userModel.findOne({ phone: phone })
            if (isPhone) {
                return res.status(400).send({ status: false, message: ` ${phone} already registered.` });
            }
        }
        if (password) {
            console.log(password)
            return res.status(400).send({ status: false, message: ` you can't update password ` });
        }
        let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, {
            $set: {
                fname: fname,
                lname: lname,
                email: email,
                phone: phone,
                password: password
            }
        }, { new: true })
        return res.status(200).send({ status: true, data: updatedUser })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { createUser, userLogin, getUser, updateUser }