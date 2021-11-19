const mongoose =require('mongoose')

// {
// 	_id: ObjectId("61951bfa4d9fe0d34da86344"),
// 	name:"Two states",
// 	author:"61951bfa4d9fe0d34da86829",
// 	price:50,
// 	ratings:4.5,
// 	publisher: "61951bfa4d9fe0d34da84523"
// A publisher document looks like this.
// {
// 	_id: ObjectId("61951bfa4d9fe0d34da86344"),
// name: “Penguin”,
// headQuarter: “New Delhi”,
// }

// }


const publishSchema=new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    author: {type:mongoose.Schema.Types.ObjectId,ref:"myAuthor"},
    price: Number,
    ratings:Number,
    publisher:{type:mongoose.Schema.Types.ObjectId,ref:"pBook"}
}, {timestamps:true} )
module.exports= mongoose.model( 'publishBook' ,publishSchema)