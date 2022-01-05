// { 
//     description: {string,mandatory} ,
//     tag: {array of string},
//     askedBy: {a referenec to user collection.,},
//     deletedAt: {Date, when the document is deleted}, 
//     isDeleted: {boolean, default: false},
//     createdAt: {timestamp},
//     updatedAt: {timestamp},
//   }

const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const questionSchema = new mongoose.Schema({
    description: { type: String, required: true, trim:true },
    tag: [{ type: String}],                   //   (Eg sci-fi, technology, coding, adventure etc)
    askedBy: { type: ObjectId, ref: 'user', require: true },
    deletedAt: { type: Date, default:null },  // when the document is deleted
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('Question', questionSchema)