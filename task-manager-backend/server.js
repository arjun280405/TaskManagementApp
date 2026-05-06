const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB, getConnectionStatus } = require("./config/db");

dotenv.config();
connectDB();

const app = express();

const normalizeOrigin = (value) => {
    if (!value) return null;

    try {
        return new URL(value).origin;
    } catch (error) {
        return value;
    }
};

const configuredOrigins = [process.env.CLIENT_URL, process.env.CLIENT_URL_ALT]
    .filter(Boolean)
    .flatMap((value) => value.split(",").map((item) => item.trim()))
    .map(normalizeOrigin)
    .filter(Boolean);

const defaultOrigins = [
    "http://localhost:5173",
    "https://taskmanagebyarjun.netlify.app",
    "https://taskmanagbyarjun.netlify.app",
];

const allowedOrigins = Array.from(new Set([...configuredOrigins, ...defaultOrigins]));

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }

        const normalizedOrigin = normalizeOrigin(origin);

        if (allowedOrigins.includes(normalizedOrigin)) {
            return callback(null, true);
        }

        return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware to check DB connection status
app.use((req, res, next) => {
    if (!getConnectionStatus() && req.path !== "/" && req.path !== "/health") {
        return res.status(503).json({
            message: "Database unavailable. Please check MongoDB connection and IP whitelist."
        });
    }
    next();
});

app.get("/", (req, res) => {
    res.send("Task Manager API is running");
});

app.get("/health", (req, res) => {
    res.json({
        status: getConnectionStatus() ? "connected" : "disconnected",
        message: getConnectionStatus() ? "API is operational" : "Waiting for database connection"
    });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

app.use((req, res) => {
    return res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
