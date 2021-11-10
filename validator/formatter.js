function Trim(){
    let a = "Rahul   "
    //a.trim()
    console.log(a.trim())
}
function changeToLowerCase(){
    let a = "Rahul   "
    console.log(a.toLowerCase())
}
function changeToUpperCase(){
    let a = "Rahul   "
    console.log(a.toUpperCase())
}
module.exports.Trim = Trim
module.exports.lowerCase = changeToLowerCase
module.exports.upperCase = changeToUpperCase