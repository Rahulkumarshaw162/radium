const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController')
const loginMiddle = require('../middleware/loginMiddle')
const questionController = require('../controllers/questionController')
const answerController = require('../controllers/answerController')


router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});

//  user api
////////////////////////////////
router.post('/register',userController.createUser)
router.post('/login',userController.userLogin)
router.get('/user/:userId/profile',loginMiddle.checkLogin,userController.getUser)
router.put('/user/:userId/profile',loginMiddle.checkLogin,userController.updateUser)
///////////////////////////////////////
//  Question api
router.post('/question',loginMiddle.checkLogin,questionController.askQuestion)
router.get('/questions',questionController.filterQuestion)
router.get('/questions/:questionId',questionController.getquestionById)
router.put('/questions/:questionId',loginMiddle.checkLogin,questionController.updateQuestion)
router.delete('/questions/:questionId',loginMiddle.checkLogin,questionController.deleteQuestion)
////////////////////////////////////
//  Answer api
router.post('/answer',loginMiddle.checkLogin,answerController.replyAnswer)
router.get('/questions/:questionId/answer',answerController.getAnswerByQuestionId)
router.put('/answer/:answerId',loginMiddle.checkLogin,answerController.updateAnswer)
router.delete('/answers/:answerId',loginMiddle.checkLogin,answerController.deleteAnswer)
module.exports = router;