const mongoose = require ('mongoose');
const bcrypt = require ('bcryptjs');


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },

    email:{
        type:String,
        required: true,
        unique:true
    },

    password:{
    type:String,
    required:true
},

    role:{
    type:String,
    enum:['customer','admin'],
    default:'customer'
}
});
// encriptar la contraseña
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
});

// comparar la contraseña ingresada al iniciar sesión
userSchema.methods.comparePassword = async function ( enteredPassawoerd ){
    return await bcrypt.compare(enteredPassawoerd, this.password);

};
module.exports = mongoose.model('User', userSchema);