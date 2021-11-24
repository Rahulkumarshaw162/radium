const express = require('express');
const router = express.Router();
const productController = require('../controller/productController')
const userController = require('../controller/userController')
const globalMiddleware = require('../middlewares/globalMiddleware')
const orderController = require('../controller/orderController')

router.post('/test-me', function (req, res, next) {    
    console.log('Inside the route handler checking the header batch: '+req.headers['batch'])
    let host = req.headers['host']
    let hostWithName = host + " " + "Sabiha Khan"
    console.log('My response headers: '+res.getHeaderNames())
    res.setHeader('hostWithName', hostWithName)
    //res.send({data: 'I was in the handler'})
    res.finalData = {data: 'I was in the handler'}
    next()
});
router.post('/createProduct', productController.createProduct)
router.post('/createUser', globalMiddleware.mid1 , userController.createUser)
router.post('/createOrder', globalMiddleware.mid1, orderController.createOrder)

module.exports = router;