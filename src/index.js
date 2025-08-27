const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db');
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/userAuth");
const redisClient = require('./config/redis');

app.use(express.json());
app.use(cookieParser());
app.use('/user', authRouter);

const InitializeConnection = async () => {
    try {
        await Promise.all([main(), redisClient.connect()]);
        console.log("Connected to DB and Redis");

        app.listen(process.env.PORT, () => {
            console.log("Server is listening at port :" + process.env.PORT);
        });
    } catch (error) {
        console.log("Error Occurred: " + error.message); 
    }
}

InitializeConnection();

