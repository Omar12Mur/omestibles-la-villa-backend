const mongosse = require ('mongoose')
const productSchema = new mongosse.Schema({
    name:{
        type:String,
        required: true
    },

    category:{
        type: String,
        required: true
    },
    weigth:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required:true
    },
    image:{
        type:String,
        default:''
    },
    stock:{
        type:Number,
        required: true,
        default:0

    }

})

module.exports = mongosse.model('Product',productSchema)