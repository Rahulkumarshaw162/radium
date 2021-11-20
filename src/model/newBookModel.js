const mongoose =require('mongoose')

const booksSchema=new mongoose.Schema({
    // name:"Two states",

    // author_id:1,

    // price:50,

    // ratings:4.5,
    name: {
        type:String,
        required:true
    },
    author_id:{
        type:Number,
        required:true
    },
    price: Number,
    ratings:Number
}, {timestamps:true} )
module.exports= mongoose.model( 'newBook' ,booksSchema)