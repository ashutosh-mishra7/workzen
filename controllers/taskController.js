const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc   Get all tasks for current user (with optional projectId filter)
// @route  GET /api/tasks
exports.getTasks = async (req, res) => {
    try {
        const filter = { createdBy: req.user.id };
        if (req.query.projectId) filter.projectId = req.query.projectId;
        if (req.query.status) filter.status = req.query.status;
        if (req.query.priority) filter.priority = req.query.priority;

        const tasks = await Task.find(filter)
            .populate('projectId', 'title')
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc   Create task
// @route  POST /api/tasks
exports.createTask = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, projectId, status, priority, dueDate } = req.body;
    try {
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        if (project.createdBy.toString() !== req.user.id)
            return res.status(403).json({ message: 'Not authorized' });

        const task = await Task.create({
            title, description, projectId, status, priority, dueDate,
            createdBy: req.user.id
        });
        const populated = await task.populate('projectId', 'title');
        res.status(201).json(populated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc   Update task
// @route  PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.createdBy.toString() !== req.user.id)
            return res.status(403).json({ message: 'Not authorized' });

        task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            .populate('projectId', 'title');
        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc   Delete task
// @route  DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.createdBy.toString() !== req.user.id)
            return res.status(403).json({ message: 'Not authorized' });

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
