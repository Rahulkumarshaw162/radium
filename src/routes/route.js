const express = require('express');
const router = express.Router();

const writerController= require("../controllers/writerControllers.js")
const bookController= require("../controllers/bookControllers.js")
const middileware = require("../middileware/authentication.js")
const reviewController = require("../controllers/reviewController")

//USER
router.post("/register", writerController.createWriter)
router.post("/login", writerController.login)

//BOOK
router.post("/books", middileware.Auth, bookController.createBook)
router.get("/books",middileware.Auth, bookController.getBook)
router.get("/books/:bookId",middileware.Auth,bookController.findBook)
router.put("/books/:bookId",middileware.Auth, bookController.updateBook)
router.delete("/books/:bookId",middileware.Auth, bookController.deleteBook)
//REVIEW

router.post("/books/:bookId/review",middileware.Auth,reviewController.reviewData)
router.put("/books/:bookId/review/:reviewId",middileware.Auth,reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId",middileware.Auth,reviewController.reviewDelete)



module.exports = router;