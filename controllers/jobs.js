const Job = require('../models/Job');
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,NotFoundError} = require('../errors')

const getAllJobs = async(req,res)=>{
    const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs})
}
const getJob = async(req,res)=>{
    const {userId} = req.user;
    const {id} = req.params // job id

    const job = await Job.findOne({
        _id:id,createdBy:userId
    })
    if(!job)
        throw new NotFoundError(`No job with id:${id}`);
    res.status(StatusCodes.OK).json({job})
}
const createJob = async(req,res)=>{
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}
const updateJob = async(req,res)=>{
    const {userId} = req.user;
    const {company,position,status} = req.body;
    const {id} = req.params // job id

    if(!company || !position)
        throw new BadRequestError("Company & Position fields cannot be empty");
        
    const temp = await Job.findOne({
        _id:id,createdBy:userId
    })
    const currentStatus = temp.status;
    
    const job = await Job.findOneAndUpdate({
        _id:id,createdBy:userId
    },{
        company:company,position:position,status:(status?status:currentStatus)
    },{
        new:true,runValidators:true
    });

    if(!job)
        throw new NotFoundError(`No job with id:${id}`);
    res.status(StatusCodes.OK).json({job})
}
const deleteJob = async(req,res)=>{
    const {userId} = req.user;
    const {id} = req.params // job id

    const job = await Job.findOneAndRemove({
        _id:id,createdBy:userId
    })
    if(!job)
        throw new NotFoundError(`No job with id:${id}`);
    
    res.status(StatusCodes.OK).send();
}
module.exports = {getAllJobs,getJob,createJob,updateJob,deleteJob};