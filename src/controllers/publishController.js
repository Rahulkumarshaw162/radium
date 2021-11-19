const publishModel= require("../models/publishModel")
const pModel = require("../models/pModel")
const myAuthorModel = require("../models/myAuthorModel")
// const myAuthorModel= require("../models/myBookModel")
const mongoose=require('mongoose')
const myBookModel = require("../models/myBookModel")


const pBooks = async function(req, res){
    const data = req.body
    let savedData = await pModel.create(data)
    res.send( { msg: savedData })
}
const publisherBook=async function(req,res){
    let data=req.body
    let authorId=req.body.author
    let publisherId=req.body.publisher
    let authorFromRequest=await myAuthorModel.findById(authorId)
    let publisheFromRequest=await pModel.findById(publisherId)
    if(authorFromRequest && publisheFromRequest){     
        let bookCreated= await publishModel.create(data)
        res.send({data:bookCreated})
    }else{
        res.send('The id provided is not valid')
    };

}

const getPublisher= async function(req,res){
    
    let publisher= await publishModel.find().populate('author',[{author_name:1}, {age:1}]);
    res.send({msg: publisher} )
}
module.exports.pBooks=pBooks
// module.exports.getPublisherBook=getPublisherBook
module.exports.publisherBook=publisherBook
module.exports.getPublisher=getPublisher