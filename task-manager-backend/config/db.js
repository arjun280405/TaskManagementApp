const mongoose = require("mongoose");

let isConnected = false;

const getMongoUri = () => {
    return process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL || "";
};

const connectDB = async () => {
    const mongoUri = getMongoUri();

    if (!mongoUri) {
        isConnected = false;
        throw new Error("Missing MongoDB connection string. Set MONGO_URI, MONGODB_URI, or DATABASE_URL in Railway.");
    }

    try {
        const conn = await mongoose.connect(mongoUri);
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
