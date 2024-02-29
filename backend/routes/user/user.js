const express = require('express');
const userrouter = express.Router();
const usercontroller = require('../../controller/user/user');
const auth =require('../../middleware/auth')
userrouter.post('/user/signup', usercontroller.signup);
userrouter.post('/user/login',usercontroller.login)
userrouter.post('/generateOtp',usercontroller.verify)
userrouter.get('/user/detail',auth,usercontroller.getAllUser)
module.exports = userrouter;