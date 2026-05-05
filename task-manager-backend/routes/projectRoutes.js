const express = require("express");
const Project = require("../models/Project");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), async (req, res) => {
    try {
        const { name, description, members } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Project name is required" });
        }

        const project = await Project.create({
            name,
            description,
            createdBy: req.user._id,
            members: Array.isArray(members) && members.length ? members : [req.user._id],
        });

        return res.status(201).json(project);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.get("/", protect, async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [{ createdBy: req.user._id }, { members: req.user._id }],
        })
            .populate("createdBy", "name email role")
            .populate("members", "name email");

        return res.status(200).json(projects);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.put("/:id/members", protect, authorizeRoles("admin"), async (req, res) => {
    try {
        const { members } = req.body;

        if (!Array.isArray(members)) {
            return res.status(400).json({ message: "Members must be an array of user IDs" });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        project.members = members;
        await project.save();

        return res.status(200).json(project);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", protect, authorizeRoles("admin"), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        await project.deleteOne();
        return res.status(200).json({ message: "Project deleted" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
