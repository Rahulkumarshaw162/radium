const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController')
const loginmiddle = require('../middleware/loginmiddle')
const productController = require('../controllers/ProductController')
// const aws = require('../Aws/Aws.js')

// aws rout

// router.post("/write-file-aws", aws.uploadFile)
// Feature 1 user api

router.post('/register', userController.userCreation)
router.post('/login', userController.userLogin)
router.get('/user/:userId/profile', loginmiddle.checkLogin,userController.getUserDetails)
router.put('/user/:userId/profile', loginmiddle.checkLogin,userController.updateProfile)

// feature 2 product api 

router.post('/products', productController.createProduct)
router.post('/products/:productId', productController.productById)

module.exports = router;