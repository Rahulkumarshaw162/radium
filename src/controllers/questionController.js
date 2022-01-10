const questionModel = require('../models/questionModel')
const userModel = require('../models/userModel')
const validator = require('../utils/validator')
const jwt = require('jsonwebtoken')
const answerModel = require('../models/answerModel')
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
        const isUser = await userModel.find({ _Id: askedBy })

        if (!isUser[0]) {
            res.status(400).send({ status: false, message: "no user" })
        }
        let creditScore = isUser[0].creditScore - 100
        if (creditScore < 0) {
            return res.status(400).send({ status: false, msg: "you can not send more than 5 ques" })
        }
        // console.log(isUser)
        // console.log(creditScore)
        // console.log(typeof creditScore)
        if (!(askedBy.toString() == tokenId.toString())) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }
        userQuestion = {
            description,
            tag,
            askedBy
        }
        const question = await questionModel.create(userQuestion);
        const updatUserCredit = await userModel.findOneAndUpdate({ _id: askedBy }, { $set: { creditScore: creditScore } }, { new: true })
        console.log(updatUserCredit)
        return res.status(201).send({ status: true, message: "Question asked succesfully.", data: { question, updatUserCredit } });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error is : " + err })
    }
}
//////////////////////////   GET /questions (public api)   //////////
const filterQuestion = async function (req, res) {
    try {
        let queryParam = req.query
        if (!validator.isValidRequestBody(queryParam)) {
            return res.status(400).send({ status: false, message: `Please provide Question's valid query details` })
        }
        let { tag, sort } = req.query
        let query = { isDeleted: false };
        if (validator.isValid(tag)) {
            query['tag'] = { $regex: tag.trim() }
        }
        let descending = "descending"
        if (sort) {
            if (!(sort == descending)) {
                return res.status(400).send({ status: false, message: ' Please provide Sort value descending' })
            }
        }
        let questionsOfQuery = await questionModel.find(query).sort({createdAt:-1})
        if (Array.isArray(questionsOfQuery) && questionsOfQuery.length === 0) {
            return res.status(404).send({ status: false, message: 'No Questions are exist for this query' })
        }
        var isAnswerForQue = [];
        for (let i=0; i<questionsOfQuery.length; i++){
            let questionId = questionsOfQuery[i]._id
            let isAnswerForQue1 = await answerModel.find({ questionId: questionId }).populate("questionId")
            // isAnswerForQue['isAnswerForQue1'] = isAnswerForQue1
            if (isAnswerForQue1[0]){
                isAnswerForQue.push(isAnswerForQue1)
            }
            // console.log(isAnswerForQue1)
            // console.log(isAnswerForQue)
        }
        if (!isAnswerForQue[0]) {
            return res.status(200).send({ status: true, message: "question find succesfully  but there is no any answer.", data: questionsOfQuery })
        }
        return res.status(200).send({ status: true, message: 'Question list with answer', data: isAnswerForQue })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}
/////////////////////////// GET /questionsById///////////////////////////
const getquestionById = async function (req, res) {
    try {
        const questionId = req.params.questionId

        if (!validator.isValidObjectId(questionId)) {
            return res.status(400).send({ status: false, message: "Invalid questionId in params." })
        }
        const isQuestion = await questionModel.findOne({ _id: questionId, isDeleted: false }).sort({createdAt:-1})
        if (!isQuestion) {
            return res.status(400).send({ status: false, message: `${questionId} doesn't exists ` })
        }
        console.log(questionId)
        isAnswerForQue = await answerModel.find({ questionId: questionId }).populate("questionId").sort({createdAt:-1})
        if (!isAnswerForQue[0]) {
            return res.status(200).send({ status: true, message: "question find succesfully  but there is no any answer.", data: isQuestion })
        }
        // console.log(isAnswerForQue[0])
        return res.status(200).send({ status: true, message: "question find with answer succesfully.", data: { isQuestion, isAnswerForQue } })
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: "Error is: " + err.message
        })
    }
}
/////////////////       PUT /questions/:questionId      //////////////

const updateQuestion = async function (req, res) {
    try {
        const questionId = req.params.questionId
        const tokenUserId = req.userId
        let requestBody = req.body

        if (!validator.isValidObjectId(questionId) || !validator.isValidObjectId(tokenUserId)) {
            return res.status(404).send({ status: false, message: "questionId or tokenId is not valid" })
        }
        const question = await questionModel.findOne({ _id: questionId, isDeleted: false })

        if (!question) {
            return res.status(404).send({ status: false, message: `question not found` })
        }
        if (!(validator.isValidRequestBody(requestBody))) {
            return res.status(400).send({ status: false, message: 'No paramateres passed in req body' })
        }
        let { description, tag } = requestBody;
        if (!validator.validString(description) ) {
            return res.status(400).send({ status: false, message: 'description should be  required' })
        }
        const newQuestion = {}
        
        if (description || tag) {
            if (validator.isValid(description)) {
                if (!(('description') in newQuestion))
                    newQuestion['description'] = description
            }
            if (validator.isValid(tag)) {
                if (!(('tag') in newQuestion))
                    newQuestion['tag'] = tag
            }
        }
        const user = await userModel.findOne({ _id: question.askedBy })
        if (!user) {
            res.status(404).send({ status: false, message: `user not found` })
            return
        }
        if (!(user._id.toString() == tokenUserId.toString())) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }

        const updatedQuestion = await questionModel.findOneAndUpdate({ _id: questionId }, newQuestion, { new: true })

        return res.status(200).send({ status: true, message: 'Successfully updated question details.', data: updatedQuestion });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error is : " + err })
    }
}

////////////////////////////////        DELETE /questions/:questionId      ///////////
const deleteQuestion = async (req, res) => {
    try {
        const questionId = req.params.questionId
        const tokenUserId = req.userId

        if (!validator.isValidObjectId(questionId) || !validator.isValidObjectId(tokenUserId)) {
            return res.status(404).send({ status: false, message: "questionId or tokenId is not valid" })
        }
        const question = await questionModel.findOne({ _id: questionId, isDeleted: false })

        if (!question) {
            return res.status(404).send({ status: false, message: `question not found` })
        }

        const user = await userModel.findOne({ _id: question.askedBy })
        if (!user) {
            res.status(404).send({ status: false, message: `user not found` })
            return
        }
        if (!(user._id.toString() == tokenUserId.toString())) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }
        const deletedQuestion = await questionModel.findOneAndUpdate({ _id: questionId }, { isDeleted: true, deletedAt: Date.now() }, { new: true })
        res.status(200).send({ status: true, msg: "Successfully deleted", data: deletedQuestion })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: err.message });
    }


}
///////////////////////////////////////
module.exports = { askQuestion, filterQuestion, getquestionById, updateQuestion, deleteQuestion }