const mongoose = require('mongoose');

async function main() {
    const uri = process.env.DB_CONNECT_STRING;
    if (!uri) {
        console.error("DB_CONNECT_STRING is undefined. Check your .env file.");
        throw new Error("DB_CONNECT_STRING is undefined");
    }
    console.log("Connecting to MongoDB with URI:", uri);
    await mongoose.connect(uri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    });
    console.log("MongoDB connected successfully");
}

module.exports = main;


