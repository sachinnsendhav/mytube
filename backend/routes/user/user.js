const express = require('express');
const userrouter = express.Router();
const usercontroller = require('../../controller/user/user');

userrouter.post('/user/signup', usercontroller.signup);
userrouter.post('/user/login',usercontroller.login)
userrouter.post('/generateOtp',usercontroller.verify)
module.exports = userrouter;