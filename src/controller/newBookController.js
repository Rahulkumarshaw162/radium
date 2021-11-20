const newbookModel= require("../model/newBookModel")

const createBooks = async function(req, res){
    const dataBook= req.body
    let savedBook= await newbookModel.create(dataBook)
    res.send( { msg: savedBook})
}
module.exports.createBooks=createBooks