const mongoose=require('mongoose')

const bookSchema=new mongoose.Schema({
    bookName: String,
    authorName: String,
    categroy: String,
    year: Number,
    // stockAvailabe:{type:Boolean}
}, {timestamps: true} )

module.exports=mongoose.model('bookCollection',bookSchema)

// String, Number
// Boolean, Object/json, array