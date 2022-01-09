const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },      //  valid email
    phone: { type: String, unique: true},     //  valid Indian mobile number,\
    creditScore:{type: Number, required: true,default:500},          // 500 for registration
    password: { type: String, required: true, min: 8, max: 15 }   // encrypted password
    
}, { timestamps: true })

module.exports = mongoose.model('user', userSchema)