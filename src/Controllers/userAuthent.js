const User = require("../models/user");
const validate = require('../utils/validator'); 
const bcrypt = require('bcrypt');         
const jwt = require('jsonwebtoken');      
const redisClient = require('../config/redis'); 
const submission = require("../models/submission");

// Register
const register = async (req, res) => {
    try {
        // validate the data
        validate(req.body);

        const { firstName, emailId, password } = req.body;   
        req.body.password = await bcrypt.hash(password, 10); 
        req.body.role = 'user';

        const user = await User.create(req.body);

        const token = jwt.sign(
            { _id: user._id, emailId: emailId,role:'user' },
            process.env.JWT_SECRET,
            { expiresIn: 60 * 60 }
        );

        res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true });
        res.status(201).send("User Registered Successfully");
    } catch (error) {
        res.status(400).send("Error: " + error.message); 
    }
}

// Login
const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!emailId || !password) {
            throw new Error("Invalid Credentials");
        }

        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid Credentials");  
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error("Invalid Credentials");
        }

        const token = jwt.sign(
            { _id: user._id, emailId: emailId ,role:user.role},
            process.env.JWT_SECRET,
            { expiresIn: 60 * 60 }
        );

        res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true });
        res.status(200).send("User Logged In Successfully");
    } catch (error) {
        res.status(401).send("Error: " + error.message); 
    }
}

// Logout
const logout = async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("No token found");
        }

        const payload = jwt.decode(token);
        if (!payload) {
            throw new Error("Invalid token");
        }

       
        const ttl = payload.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
            await redisClient.set(`token:${token}`, 'blocked', { EX: ttl });
        }

        // clear cookie
        res.cookie('token', '', { expires: new Date(0) });
        res.send("User Logged Out Successfully");
    } catch (error) {
        res.status(401).send("Error: " + error.message);
    }
}

const adminRegister = async (req, res) => {
    try {
        // validate the data
        validate(req.body);

        const { firstName, emailId, password } = req.body;   
        req.body.password = await bcrypt.hash(password, 10); 
        req.body.role = 'admin';

        const user = await User.create(req.body);

        const token = jwt.sign(
            { _id: user._id, emailId: emailId, role: 'admin' }, 
            process.env.JWT_SECRET,
            { expiresIn: 60 * 60 }
        );

        res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true });
        res.status(201).send("Admin Registered Successfully");  
    } catch (error) {
        res.status(400).send("Error: " + error.message); 
    }
};




// Delete Profile
const deleteProfile = async (req, res) => {
try {
    const userId=req.user._id;
  await   User.findByIdAndDelete(userId)
  await submission.deleteMany({userId})
  res.status(200).send("User Deleted Successfully")

} catch (error) {
    res.status(400).send("Error: " + error.message);
}
}
module.exports = { register, login, logout ,adminRegister,deleteProfile};

