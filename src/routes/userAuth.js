const express=require('express');
const authRouter=express.Router();
const {register,login,logout,getProfile,adminRegister}=require('../Controllers/userAuthent');
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

//Register
authRouter.post('/register',register);
//Login
authRouter.post('/login',login);
//Logout
authRouter.post('/logout',userMiddleware,logout);
authRouter.post('/admin/register',adminMiddleware,adminRegister);
//GetProfile
//authRouter.get('getProfile',getProfile);


module.exports=authRouter;