const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please provide name'],
        minlength:3,
        maxlength:50,
    },
    email:{
        type:String,
        required:[true,'please provide email'],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ,'Please provide valid email'
        ],
        unique:true, // to prevent duplication
    },
    password:{
        type:String,
        required:[true,'please provide name'],
        minlength:6,
    }
})

// mongoose middleware
userSchema.pre('save',async function(next){
    // this refers to query object
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

// mongoose schema instance methods
userSchema.methods.getName = function(){
    return this.name; // dont use arrow function as this refers to one level behind in scope for arrow functions
}
userSchema.methods.createJWT = function(){
    return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}
userSchema.methods.comparePassword = async function(pass){
    const isMatch = await bcrypt.compare(pass,this.password);
    return isMatch;
}
module.exports = mongoose.model('User',userSchema);