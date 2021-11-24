const mongoose  = require('mongoose');

const orderSchema=new mongoose.Schema({

    // userId: “61951bfa4d9fe0d34da86829”,
    // productId: “61951bfa4d9fe0d34da86344”
    // amount: 0,
    // isFreeAppUser: true, 
    // date: “22/11/2021”
    // }
    userId:{type:mongoose.Schema.Types.ObjectId, ref:"user"},
    productId:{type:mongoose.Schema.Types.ObjectId, ref:"product"},
    amount:Number,
    isFreeAppUser:Boolean,
    date:Date
},{timestamps: true})
module.exports = mongoose.model( 'order', orderSchema )