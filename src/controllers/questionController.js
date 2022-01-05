const questionModel = require('../models/questionModel')
const userModel = require('../models/userModel')
const validator = require('../utils/validator')
const jwt = require('jsonwebtoken')
// const bcrypt = require('bcrypt')
// const saltRounds = 10

///////////////////////////user///////////////////////
const askQuestion = async function (req, res) {
    try {
        let requestBody = req.body
        let tokenId = req.userId
        let { description, tag, askedBy } = requestBody

        // validation start
        if (!validator.isValidObjectId(tokenId)) {
            return res.status(400).send({ status: false, message: "userId or token is not valid" });;
        }
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "please provide valid request body" })
        }
        if (!validator.isValid(description)) {
            return res.status(400).send({ status: false, message: "description is missing" })
        }
        if (!validator.isValid(askedBy)) {
            return res.status(400).send({ status: false, message: "askedBy is missing" })
        }
        if (!validator.isValidObjectId(askedBy)) {
            return res.status(400).send({ status: false, message: "userId or token is not valid" });;
        }
        userQuestion = {
            description,
            tag,
            askedBy
        }
        const question = await questionModel.create(userQuestion);
        return res.status(201).send({ status: true, message: "Question asked succesfully.", data: question });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error is : " + err })
    }
}
/////////////////////////// GET /questionsById//////////////////
const getquestionById = async function (req, res) {
    try {
        const questionId = req.params.questionId

        if (!validator.isValidObjectId(questionId)) {
            return res.status(400).send({ status: false, message: "Invalid questionId in params." })
        }
        const isQuestion = await questionModel.findOne({ _id: questionId })
        if (!isQuestion) {
            return res.status(400).send({ status: false, message: `${QuestionId} doesn't exists ` })
        }
        return res.status(200).send({ status: true, message: "question find by ID succesfully.", data: isQuestion })
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: "Error is: " + err.message
        })
    }
}
/////////////////       PUT /questions/:questionId      //////////////

// const updateQuestion = async function(req, res) {
//     try {
//         const questionId = req.params.userId
//         const tokenUserId = req.userId

//         if (!isValidObjectId(questionId) && !isValidObjectId(tokenUserId)) {
//             return res.status(404).send({ status: false, message: "questionId or token is not valid" })
//         }
//         const questio = await userModel.findOne({ _id: userId })
//         if (!user) {
//             res.status(404).send({ status: false, message: `user not found` })
//             return
//         }
//         if (!(userId.toString() == tokenUserId.toString())) {
//             return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
//         }

//         let { fname, lname, email, phone, password, address } = req.body

//         const profileImage = req.urlimage

//         const filterQuery = {};
//         if (isValid(fname)) {
//             filterQuery['fname'] = fname.trim()
//         }

//         filterQuery.profileImage = profileImage;
//         const userdetails = await userModel.findOneAndUpdate({ userId }, filterQuery, { new: true })
//         return res.status(200).send({ status: true, message: "User profile Details", data: userdetails })

//     } catch (error) {
//         res.status(500).send({ status: false, message: error.message })
//     }
// }

module.exports = { askQuestion, getquestionById}