const mongoose = require('mongoose');

const CartItemSchma =  new mongoose.Schema({
    product :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },

    quantity:{
        type:Number,
        required:true,
        default:1
    }

});

const cartShema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
        unique: true
    },

    items:{
        type:[CartItemSchma],
        default:[]
    }

},{
    timestamps: true

});