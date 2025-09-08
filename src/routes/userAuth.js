const express = require('express');
const authRouter = express.Router();

const { 
    register, 
    login, 
    logout, 
    adminRegister, 
    deleteProfile, 
    getProfile 
} = require('../Controllers/userAuthent');

const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Register
authRouter.post('/register', register);

// Login
authRouter.post('/login', login);

// Logout (only logged in user can logout)
authRouter.post('/logout', userMiddleware, logout);

// Admin Register (only admin can create another admin)
authRouter.post('/admin/register', adminMiddleware, adminRegister);

// Delete Profile (only logged in user can delete themselves)
authRouter.delete('/deleteProfile', userMiddleware, deleteProfile);

// Get Profile (only logged in user can see their profile)
authRouter.get('/profile', userMiddleware, getProfile);

// Check if user is valid (for testing middleware)
authRouter.get('/check', userMiddleware, (req, res) => {
    const reply = {
        firstName: req.user.firstName,
        emailId: req.user.emailId,
        _id: req.user._id
    };
    res.status(200).json({
        user: reply,
        message: "Valid User"
    });
});

module.exports = authRouter;

