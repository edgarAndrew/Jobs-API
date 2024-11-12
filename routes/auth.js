const express = require('express')
const router = express.Router();

const {register,login} = require('../controllers/auth');
const authMiddleware = require('../middleware/authentication');

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/load').get(authMiddleware,async(req,res)=> res.status(StatusCodes.OK).json({"userId":req.user.userId,"username":req.user.name}));

module.exports = router;
