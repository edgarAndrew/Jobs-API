const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { BadRequestError,UnauthenticatedError } = require('../errors');

const register = async(req,res)=>{
    /* // Handled by middlware in user model (pre)
    
    const {name,email,password} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    const tempUser = {name,email,password:hashedPassword};
    const user = await User.create({...tempUser})
    */
   
    const user = await User.create({...req.body});
    /*const token = jwt.sign({userId:user._id,name:user.name},'jwtSecret',{expiresIn:'30d'}) Replaced by an instance method in user Schema*/
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({user:{name:user.getName()},token}); // getName() is an instance method of the schema
    
}
const login = async(req,res)=>{
    const {email,password} = req.body;
    //if(!email || !password)
        //throw new BadRequestError('Please provide email & password');
    
    const user = await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const passCorrect = await user.comparePassword(password);
    if(!passCorrect){
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user:{name:user.getName()},token});

}
module.exports = {register,login};