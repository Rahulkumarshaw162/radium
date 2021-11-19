const myAuthorModel= require("../models/myAuthorModel")
const myBookModel = require("../models/myBookModel")

const creatAuthors = async function(req, res){
    const data = req.body
    
    let savedAuthor= await myAuthorModel.create(data)
    res.send( { msg: savedAuthor})
}
module.exports.creatAuthors= creatAuthors