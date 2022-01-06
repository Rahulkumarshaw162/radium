const answerModel = require('../models/answerModel')
const questionModel = require('../models/questionModel')
const userModel = require('../models/userModel')
const validator = require('../utils/validator')
const jwt = require('jsonwebtoken')

/////////////////////////////////////POST /answer(authentication and authorisation required)/////

const replyAnswer = async function (req, res) {
    try {
        let requestBody = req.body
        let tokenId = req.userId
        let { answeredBy, text, questionId } = requestBody

        // validation start
        if (!validator.isValidObjectId(tokenId)) {
            return res.status(400).send({ status: false, message: "userId or token is not valid" });;
        }
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "please provide valid request body" })
        }
        if (!validator.isValid(answeredBy)) {
            return res.status(400).send({ status: false, message: "answeredBy is missing" })
        }
        if (!validator.isValid(text)) {
            return res.status(400).send({ status: false, message: "text is missing" })
        }
        if (!validator.isValid(questionId)) {
            return res.status(400).send({ status: false, message: "questionId is missing" })
        }
        if (!validator.isValidObjectId(answeredBy)) {
            return res.status(400).send({ status: false, message: "answeredBy  is not valid" });
        }
        if (!validator.isValidObjectId(questionId)) {
            return res.status(400).send({ status: false, message: "questionId  is not valid" });
        }
        userAnswer = {
            answeredBy,
            text,
            questionId
        }
        const answer = await answerModel.create(userAnswer);
        return res.status(201).send({ status: true, message: "User reply answer succesfully.", data: answer });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error is : " + err })
    }
}
///////////////////////////////     GET questions/:questionId/answer      ////////////////////
const getAnswerByQuestionId = async function (req, res) {
    try {
        const questionId = req.params.questionId

        if (!validator.isValidObjectId(questionId)) {
            return res.status(400).send({ status: false, message: "Invalid questionId in params." })
        }
        const isQuestion = await questionModel.findOne({ _id: questionId, isDeleted: false })
        if (!isQuestion) {
            return res.status(400).send({ status: false, message: `${questionId} doesn't exists ` })
        }
        // const isAnswer = await answerModel.find({ questionId: questionId, isDeleted: false })
        // // console.log(isAnswer[0])
        // if (!isAnswer[0]) {
        //     return res.status(400).send({ status: false, message: `For this ${questionId} no answer exists ` })
        // }
        
        isAnswerForQue = await answerModel.find({ questionId: questionId,isDeleted: false }).populate("questionId")
        if (!isAnswerForQue[0]) {
            return res.status(200).send({ status: true, message: "question find succesfully  but there is no any answer.", data: isQuestion })
        }
        // console.log(isAnswerForQue[0])
        return res.status(200).send({ status: true, message: "question find with answer succesfully.", data: { isAnswerForQue } })
        // return res.status(200).send({ status: true, message: "All answer find by question succesfully.", data: isAnswer })
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: "Error is: " + err.message
        })
    }
}
//////////////////////////////      PUT /answer/:answerId       //////////
// onyl the user posted the answer can edit the answer
const updateAnswer = async function (req, res) {
    try {
        const answerId = req.params.answerId
        const tokenUserId = req.userId
        let requestBody = req.body

        if (!validator.isValidObjectId(answerId) || !validator.isValidObjectId(tokenUserId)) {
            return res.status(404).send({ status: false, message: "answerId or tokenId is not valid" })
        }
        const answer = await answerModel.findOne({ _id: answerId, isDeleted: false })

        if (!answer) {
            return res.status(404).send({ status: false, message: `answer not exist` })
        }
        if (!(validator.isValidRequestBody(requestBody))) {
            return res.status(400).send({ status: false, message: 'No paramateres passed in req body' })
        }
        let { text } = requestBody;

        const newAnswer = {}
        if (validator.isValid(text)) {
            if (!(('text') in newAnswer))
                newAnswer['text'] = text
        }

        const user = await userModel.findOne({ _id: answer.answeredBy })
        if (!user) {
            res.status(404).send({ status: false, message: `user not found` })
            return
        }
        if (!(user._id.toString() == tokenUserId.toString())) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }

        const updatedAnswer = await answerModel.findOneAndUpdate({ _id: answerId, isDeleted: false }, newAnswer, { new: true }).populate("questionId")

        return res.status(200).send({ status: true, message: 'Successfully updated question details.', data: updatedAnswer });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error is : " + err })
    }
}
/////////////////////////        DELETE answers/:answerId      /////////////////
const deleteAnswer = async function (req, res) {
    try {
        const answerId = req.params.answerId
        const tokenUserId = req.userId
        const requestBody = req.body
        // let answeredBy = requestBody.userId
        // let questionId = requestBody.questionId
        // let requestBody = req.body
        let { answeredBy, questionId } = requestBody;
        if (!validator.isValidObjectId(answerId) || !validator.isValidObjectId(tokenUserId)) {
            return res.status(404).send({ status: false, message: "answerId or tokenId is not valid" })
        }
        if (!validator.isValidObjectId(answeredBy) || !validator.isValidObjectId(questionId)) {
            return res.status(404).send({ status: false, message: "answeredBy or questionId is not valid" })
        }
        const answer = await answerModel.findOne({ _id: answerId, isDeleted: false })

        if (!answer) {
            return res.status(404).send({ status: false, message: `answer not exist` })
        }
        if (!(validator.isValidRequestBody(requestBody))) {
            return res.status(400).send({ status: false, message: 'No paramateres passed in req body' })
        }


        // const newAnswer = {}
        // if (validator.isValid(text)) {
        //     if (!(('text') in newAnswer))
        //         newAnswer['text'] = text
        // }
        if ((answer.answeredBy != answeredBy) && (answer.questionId != questionId)) {
            res.status(404).send({ status: false, message: `for this qnswer  no availbility` })
        }
        const user = await userModel.findOne({ _id: answeredBy })
        if (!user) {
            res.status(404).send({ status: false, message: `user not found` })
            return
        }
        if (!(user._id.toString() == tokenUserId.toString())) {
            return res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
        }

        const deletedAnswer = await answerModel.findOneAndUpdate({ _id: answerId, isDeleted: false }, { isDeleted: true }, { new: true })

        return res.status(200).send({ status: true, message: 'Successfully answer deleted.', data: deletedAnswer });
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error is : " + err })
    }
}

////////////////////////////////////////////////////////
module.exports = { replyAnswer, getAnswerByQuestionId, updateAnswer, deleteAnswer }