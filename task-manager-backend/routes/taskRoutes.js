const express = require("express");
const Task = require("../models/Task");
const Project = require("../models/Project");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorizeRoles("admin"), async (req, res) => {
    try {
        const { title, description, projectId, assignedTo, dueDate, status } = req.body;

        if (!title || !projectId || !assignedTo) {
            return res.status(400).json({ message: "title, projectId and assignedTo are required" });
        }

        const existingProject = await Project.findById(projectId);
        if (!existingProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        const isMember = existingProject.members.some(
            (memberId) => memberId.toString() === assignedTo.toString()
        );

        if (!isMember) {
            return res.status(400).json({ message: "Assigned user must be a member of the project" });
        }

        const task = await Task.create({
            title,
            description,
            projectId,
            assignedTo,
            dueDate,
            status,
        });

        return res.status(201).json(task);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.get("/", protect, async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id })
            .populate("projectId", "name")
            .populate("assignedTo", "name email")
            .sort({ dueDate: 1, createdAt: -1 });

        return res.status(200).json(tasks);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.put("/:id", protect, async (req, res) => {
    try {
        const { status } = req.body;

        if (!["Todo", "In Progress", "Done"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isAssignee && !isAdmin) {
            return res.status(403).json({ message: "Forbidden" });
        }

        task.status = status;
        const updatedTask = await task.save();

        const populatedTask = await Task.findById(updatedTask._id)
            .populate("projectId", "name")
            .populate("assignedTo", "name email");

        return res.status(200).json(populatedTask);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", protect, authorizeRoles("admin"), async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.deleteOne();
        return res.status(200).json({ message: "Task deleted" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
