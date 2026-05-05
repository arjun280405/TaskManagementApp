const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide name, email and password" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const allowedRoles = ["admin", "member"];
        const normalizedRole = allowedRoles.includes(role) ? role : "member";

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: normalizedRole,
        });

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.get("/me", protect, async (req, res) => {
    return res.status(200).json(req.user);
});

router.get("/users", protect, authorizeRoles("admin"), async (req, res) => {
    try {
        const users = await User.find().select("name email role").sort({ createdAt: -1 });
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
