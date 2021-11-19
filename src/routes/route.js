const express = require('express');

const router = express.Router();
const myAuthorController= require("../controllers/myAuthorController")
const myBookControler= require("../controllers/myBookController")
const publishController= require("../controllers/publishController")

router.get('/test-me', function (req, res) {
    res.send('My first ever api!')
});
// author  api
router.post('/creatAuthors',  myAuthorController.creatAuthors);

// book api
router.post('/createBooks',  myBookControler.createBooks);
router.get('/Books', myBookControler.Books)
router.post('/publisherBook', publishController.publisherBook)
router.get('/getPublisher', publishController.getPublisher)

// publish api
// router.post('/publishBooks', publishController.publishBooks)

// pMode api
router.post('/pBooks', publishController.pBooks)


module.exports = router;