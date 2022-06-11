const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    company:{
        type:String,
        required:[true,"Please provide company name"],
        maxlenght:50
    },
    position:{
        type:String,
        required:[true,"Please provide position"],
        maxlenght:70
    },
    status:{
        type:String,
        enum:['pending','interview','declined'],
        default:'pending',
    },
    createdBy:{ // This property is crucial so that we know which user has created this job
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,"Please provide user"],
    }
},{timestamps:true}) 
// If we want createdAt & updatedAt time inserted to every document by default we set timestamps as true

module.exports = mongoose.model('Job',jobSchema);