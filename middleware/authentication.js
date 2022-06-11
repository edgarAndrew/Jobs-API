const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')

// This authentication will be set in the jobs router to all routes 
// as only single user must be able to perform CRUD ops for his account
// Note : Every user gets a unique jwt token

async function authenticationMiddleware(req,res,next){
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer '))
        UnauthenticatedError("No Token provided");
    const token = authHeader.split(' ')[1];
    try{
        const payload = jwt.verify(token,process.env.JWT_SECRET);
        const {userId,name} = payload;
        req.user = {userId,name};
    }catch(err){
        throw new UnauthenticatedError("Not allowed to access this route")
    }
    next();
}
module.exports = authenticationMiddleware;