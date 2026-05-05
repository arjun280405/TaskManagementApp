const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        isConnected = false;
        console.error(`MongoDB connection error: ${error.message}`);
        if (process.env.NODE_ENV !== "test") {
            console.log("Retrying connection in 5 seconds...");
            setTimeout(connectDB, 5000);
        }
    }
};

const getConnectionStatus = () => isConnected;

module.exports = { connectDB, getConnectionStatus };
