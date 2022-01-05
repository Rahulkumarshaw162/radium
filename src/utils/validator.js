const mongoose = require('mongoose')

const isValid = function(value) {
    if (typeof value === 'undefined' || value === null) return false //it checks whether the value is null or undefined.
    if (typeof value === 'string' && value.trim().length === 0) return false //it checks whether the string contain only space or not 
    return true;
};
const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0; // it checks, is there any key is available or not in request body
};
const validateEmail = function(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const isValidNumber = function(phone) {
    const reNumber = /^[0-9]{10}$/
    return reNumber.test(phone)
}
const isValidLength = function(value, min, max) {
    const len = String(value).length
    return len >= min && len <= max
}
const validString = function(value) {
    if (typeof value === 'string' && value.trim().length === 0) return false 
    return true;
}

module.exports = {
    isValid,
    isValidRequestBody,
    validateEmail,
    isValidObjectId,
    isValidObjectId,
    isValidNumber,
    isValidLength,
    validString
}