// {
//     answeredBy: {ObjectId, refs to User, mandatory},
//     text: {string, mandatory},
//     questionId: {ObjectId, refs to question, mandatory}, 
//     createdAt: {timestamp},
//     updatedAt: {timestamp},
//   }

const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const answerSchema = new mongoose.Schema({
    answeredBy: { type: ObjectId, ref: 'user', require: true },
    text: { type: String, required: true, trim: true },
    questionId: { type: ObjectId, ref: 'Question', require: true },
    deletedAt: { type: Date, default: null },  // when the document is deleted
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Answer', answerSchema)