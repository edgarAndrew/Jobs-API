const express = require('express')
const router = express.Router();

// authentication (jwt verifying) middleware
const authMiddleware = require('../middleware/authentication');

const {getAllJobs,getJob,createJob,
    updateJob,deleteJob} = require('../controllers/jobs');

router.route('/').get(authMiddleware,getAllJobs).post(authMiddleware,createJob);
router.route('/:id').get(authMiddleware,getJob).patch(authMiddleware,updateJob).delete(authMiddleware,deleteJob)

module.exports = router