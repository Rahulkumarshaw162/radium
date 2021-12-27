const userModel = require('../models/UserModel')
const validator = require('../validation/validator')
const config = require('../Aws/Aws')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { findOneAndUpdate } = require('../models/UserModel')
const saltRounds = 10


const userCreation = async (req, res) => {
    try {
        let files = req.files;
        let requestBody = req.body;
        let { fname, lname, profileImage, email, phone, password, address } = requestBody

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "please provide valid request body" })
        }
        if (!validator.isValid(fname)) {
            return res.status(400).send({ status: false, message: "fname is required" })
        }
        if (!validator.isValid(lname)) {
            return res.status(400).send({ status: false, message: "lname is required" })
        }
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: "email is required" })
        }
        if (!validator.validateEmail(email)) {
            return res.status(400).send({ status: false, message: "email is invalid" })
        }
        const isEmailAleadyUsed = await userModel.findOne({ email })
        if (isEmailAleadyUsed) {
            return res.status(400).send({ status: false, message: "Email is already in use, try something different" })
        }
        // if (!validator.isValid(profileImage)) {
        //     return res.status(400).send({ status: false, message: "ProfileImage link is required" })
        // }
        if (!validator.isValid(phone)) {
            return res.status(400).send({ status: false, message: "phone is required" })
        }
        if (!validator.validatePhone(phone)) {
            return res.status(400).send({ status: false, message: "phone is invalid" })
        }
        const isPhoneAleadyUsed = await userModel.findOne({ phone })
        if (isPhoneAleadyUsed) {
            return res.status(400).send({ status: false, message: "Phone is already in use, try something different" })
        }
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" })
        }
        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, message: "password should be of minimum 8 and maximum 15 character" })
        }
        if (!validator.isValid(address)) {
            return res.status(400).send({ status: false, message: "address is required" })
        }
        if (address) {
            // if (!address.shipping && address.billing) {
            //     return res.status(400).send({ status: false, message: "Address must contain both full shipping and billing address." })
            // }
            if (!validator.isValid(address.shipping.street)) return res.status(400).send({ status: false, message: "Shipping address must contain complete street details." })

            if (!validator.isValid(address.shipping.city)) return res.status(400).send({ status: false, message: "Shipping address must contain city." })

            if (!validator.isValid(address.shipping.pincode)) return res.status(400).send({ status: false, message: "Shipping address must contain a valid pincode." })

            if (!validator.isValid(address.billing.street)) return res.status(400).send({ status: false, message: "Billing address must contain city." })

            if (!validator.isValid(address.billing.city)) return res.status(400).send({ status: false, message: "Billing address must contain Street, City and Pincode." })

            if (!validator.isValid(address.billing.pincode)) return res.status(400).send({ status: false, message: "Billing address must contain a valid pincode." })
        }
        profileImage = await config.uploadFile(files[0]);
        if (!validator.isValid(profileImage)) {
            return res.status(400).send({ status: false, message: "profileImage is required" })
        }
        console.log(profileImage)
        const encryptedPassword = await bcrypt.hash(password, saltRounds)
        let userData = {
            fname,
            lname,
            email,
            profileImage,
            phone,
            password: encryptedPassword,
            address
        }
        const saveUserData = await userModel.create(userData);
        console.log(profileImage)
        return res
            .status(201)
            .send({
                status: true,
                message: "user created successfully.",
                data: saveUserData
            });
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: "Error is : " + err
        })
    }
}

const userLogin = async function (req, res) {
    try {
        const requestBody = req.body
        const UserEmail = req.body.email
        const UserPass = req.body.password
        if (!validator.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide login details' })
            return
        }
        if (!validator.isValid(UserEmail)) {
            res.status(400).send({ status: false, message: 'email key is required' })
            return
        }
        if (!validator.isValid(UserPass)) {
            res.status(400).send({ status: false, message: 'password key is required' })
            return
        }


        if (!validator.validateEmail(UserEmail)) {
            res.status(400).send({ status: false, message: `Email should be a valid email address` })
            return
        }
        let user = await userModel.findOne({ email: UserEmail, });
        // Validation ends

        console.log(user);
        if (user) {
            const { password } = user
            const match = await bcrypt.compare(UserPass, password)
            console.log(match)
            if (!match) {
                res.status(400).send({ status: false, message: `Password is Invalid` })
            }

        }
        const userId = user._id
        const token = jwt.sign({
            userId: userId,
            iat: Math.floor(Date.now() / 1000), //time of issuing the token.
            exp: Math.floor(Date.now() / 1000) + 60 * 24 * 7 //setting token expiry time limit.
        }, 'group5')

        res.status(200).send({
            status: true,
            message: `user login successfull`,
            data: {
                userId,
                token
            }
        });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

// get userdetails

const getUserDetails = async function (req, res) {
    try {
        const userId = req.params.userId
        const userIdFromToken = req.userId
        console.log(userIdFromToken)
        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
        }

        const user = await userModel.findById({ _id: userId });

        if (!user) {
            return res.status(404).send({ status: false, message: `user does not exit` })
        }
        if (userIdFromToken != user._id) {
            return res.status(403).send({
                status: false,
                message: "Unauthorized access."
            })
        }
        else {
            res.status(200).send({ status: true, message: "succesfully fetch user details", data: user })
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

// update user
const updateProfile = async function (req, res) {
    try {
        let files = req.files;
        const userId = req.params.userId
        const userIdFromToken = req.userId
        const requestUpdateBody = req.body
        // console.log(requestUpdateBody)
        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
        }
        if (!validator.isValidObjectId(userIdFromToken)) {
            res.status(400).send({ status: false, message: `${userIdFromToken} is not a valid token id` })
            return
        }
        let { fname, lname, email, profileImage, phone, password, address } = requestUpdateBody

        if (validator.isValidRequestBody(files)) {
            if (!(files && files.length > 0)) {
                return res.status(400).send({ status: false, message: "Invalid request parameter, please provide profile image" })
            }

        }
        if (requestUpdateBody) {
            if (!validator.isValidRequestBody(requestUpdateBody)) {
                return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide user details to update.' })
            }
            //validation ends
            if (fname || lname || email || phone || password || address || profileImage) {
                //validation for empty strings/values.
                if (!validator.validString(fname)) {
                    return res.status(400).send({ status: false, message: "fname is missing ! Please provide the fname details to update." })
                }
                if (!validator.validString(lname)) {
                    return res.status(400).send({ status: false, message: "lname is missing ! Please provide the lname details to update." })
                }
                if (!validator.validString(email)) {
                    return res.status(400).send({ status: false, message: "email is missing ! Please provide the email details to update." })
                }
                if (!validator.validString(phone)) {
                    return res.status(400).send({ status: false, message: "phone number is missing ! Please provide the phone number to update." })
                }
                if (!validator.validString(password)) {
                    return res.status(400).send({ status: false, message: "password is missing ! Please provide the password to update." })
                }
                //shipping address validation
                if (!validator.validString(address)) {
                    return res.status(400).send({ status: false, message: "address is required" })
                }
                if (address) {

                    if (!validator.validString(address.shipping.street)) return res.status(400).send({ status: false, message: "Shipping address must contain complete street details." })

                    if (!validator.validString(address.shipping.city)) return res.status(400).send({ status: false, message: "Shipping address must contain city." })

                    if (!validator.validNumber(address.shipping.pincode)) return res.status(400).send({ status: false, message: "Shipping address must contain a valid pincode." })

                    if (!validator.validString(address.billing.street)) return res.status(400).send({ status: false, message: "Billing address must contain city." })

                    if (!validator.validString(address.billing.city)) return res.status(400).send({ status: false, message: "Billing address must contain Street, City and Pincode." })

                    if (!validator.validNumber(address.billing.pincode)) return res.status(400).send({ status: false, message: "Billing address must contain a valid pincode." })
                }
                // const newProfileImage = await config.uploadFile(files[0]);
                // console.log(newProfileImage)
                // if (!validator.validString(newProfileImage)) {
                //     return res.status(400).send({ status: false, message: "profileImage is required" })
                // }

                const findProfile = await userModel.findById({ _id: userId })
                if (!findProfile) {
                    res.status(404).send({ status: false, message: `Profile not found` })
                    return
                }
                if (userIdFromToken != findProfile._id) {
                    return res.status(403).send({
                        status: false,
                        message: "Unauthorized access."
                    })
                }
                //finding email and phone in DB to maintain their uniqueness.
                const findEmail = await userModel.findOne({ email: email })
                if (findEmail) {
                    return res.status(400).send({
                        status: false,
                        message: `${email} already exists. Cannot update!`
                    })
                }
                const findPhone = await userModel.findOne({ phone: phone })
                if (findPhone) {
                    return res.status(400).send({
                        status: false,
                        message: `${phone} already exists. Cannot update!`
                    })
                }
                if (requestUpdateBody.password) {
                    var encryptedPassword = await bcrypt.hash(requestUpdateBody.password, saltRounds)
                }
                // const profileImage = await config.uploadFile(files[0]);
            }

            const updateDetails = await userModel.findByIdAndUpdate({ _id: userId }, { fname: fname, lname: lname, profileImage: profileImage, email: email, phone: phone, password: encryptedPassword, address: address, new: true })
            return res.status(200).send({ status: true, message: 'Profile updated successfully', data: updateDetails });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}
module.exports = { userCreation, userLogin, getUserDetails, updateProfile }