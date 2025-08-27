const jwt = require('jsonwebtoken');
const User = require('../models/user');           
const redisClient = require('../config/redis.js'); 

const adminMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("Unauthorized Access");
        }

        // verify token
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const { _id } = payload;
        if (!_id) {
            throw new Error("Invalid Token");
        }

        // check user exists
        const result = await User.findById(_id);


        if(payload.role!=='admin')
        {
            throw new Error("Unauthorized Access");
        }
        if (!result) {
            throw new Error("User Does Not Exist");
        }

        // check if token is blocklisted in redis
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            throw new Error("Invalid Token");
        }

        req.user = result; 
        next();
    } catch (error) {
        res.status(401).send("Error: " + error.message);
    }
};

module.exports = adminMiddleware;