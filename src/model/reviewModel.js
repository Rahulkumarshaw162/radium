const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({

    bookId: {type: mongoose.Schema.Types.ObjectId, ref: 'bookDB',required:true},
    reviewedBy: {type:String,required:true,default:"Guest"},
    reviewedAt: {type:Date, required:true,default: null},
    rating: {type:Number, min:1, max:5, required:true},
    review: {type:String},
    isDeleted:{type:Boolean,default:false}

}, { timestamps: true })

module.exports = mongoose.model('reviewDB', reviewSchema)