const express=require('express');
const authRouter=express.Router();
const {register,login,logout,getProfile,adminRegister,deleteProfile}=require('../Controllers/userAuthent');
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

//Register
authRouter.post('/register',register);
//Login
authRouter.post('/login',login);
//Logout
authRouter.post('/logout',userMiddleware,logout);
authRouter.post('/admin/register',adminMiddleware,adminRegister);
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile );
//GetProfile
//authRouter.get('getProfile',getProfile);
authRouter.get('/check',userMiddlewareMiddleware,(req,res)=>{
    const reply={
        firstName:req.user.firstName,
        emailId:req.user.emailId,
        _id:req.user._id
    }
    res.status(200).json({
        user:reply,
        message:"valid User"
    })
});

module.exports=authRouter;