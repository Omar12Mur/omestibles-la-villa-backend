const mongoose = require('mongoose');

const orderItemSchem = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required: true
    },
    name:{
        type:String
    },
    quantity:{
        type:Number,
        required:true
    },
    unitPrice:{
        type:Number,
        required:true
    }
})

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    items:{
        type:[orderItemSchem],
        required: true
    },
    status:{
        type:String,
        enum:['pending','paid','shipped','cancelled'],
        default: 'pending'
    }

},{
    timestamps: true
});

modelu.exports = mongoose.model('Order',orderSchema)