const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const main = require('./config/db');
const cookieParser = require('cookie-parser');
const authRouter = require("./routes/userAuth");
const redisClient = require('./config/redis');
const problemRouter = require('./routes/problemCreator');
const submitRouter = require('./routes/submit');


const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());
app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);

const InitializeConnection = async () => {
    try {
        await Promise.all([main(), redisClient.connect()]);
        console.log("Connected to DB and Redis");

        app.listen(process.env.PORT, () => {
            console.log("Server is listening at port :" + process.env.PORT);
        });
    } catch (error) {
        console.error("Error Occurred: " + error.message);
    }
}

InitializeConnection();


