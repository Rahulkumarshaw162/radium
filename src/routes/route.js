const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController')
const loginMiddle = require('../middleware/loginMiddle')
const questionController = require('../controllers/questionController')


router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});

//  user api

router.post('/register',userController.createUser)
router.post('/login',userController.userLogin)
router.get('/user/:userId/profile',loginMiddle.checkLogin,userController.getUser)
router.put('/user/:userId/profile',loginMiddle.checkLogin,userController.updateUser)

//  Question api
router.post('/question',loginMiddle.checkLogin,questionController.askQuestion)
router.get('/questions/:questionId',questionController.getquestionById)
// PUT /questions/:questionId
module.exports = router;