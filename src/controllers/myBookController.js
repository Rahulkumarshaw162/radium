const myBookModel= require("../models/myBookModel")

const createBooks = async function(req, res){
    const dataBook= req.body
    
    let savedBook= await myBookModel.create(dataBook)
    res.send( { msg: savedBook})
}
const Books=async function(req,res){
    
    let allBook= await myBookModel.find().populate('author');
    res.send(allBook)
}
module.exports.createBooks=createBooks
module.exports.Books=Books