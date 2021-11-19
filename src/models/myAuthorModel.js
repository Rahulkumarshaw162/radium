const mongoose=require('mongoose')


// { 
//     _id: ObjectId("61951bfa4d9fe0d34da86829"),
//         author_name:"Chetan Bhagat",
//         age:25,
//         address:"New delhi"
//  }
    
const authorsSchema =new mongoose.Schema( {
    author_name:{
        type: String,
        required:true
    },
    age: Number,
    address: String
},{timestamps: true})

module.exports = mongoose.model( 'myAuthor',authorsSchema )