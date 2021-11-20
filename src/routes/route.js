const express = require('express');

const router = express.Router();
const midWare = require('../commonMiddleware/commonMiddleware')
const newBookController = require('../controller/newBookController')


// Task-2 this is multiple middleware function in a single route
router.get('/createBooks',midWare.mid1,midWare.mid2,midWare.mid3,midWare.mid4, newBookController.createBooks) 


router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});

module.exports = router;