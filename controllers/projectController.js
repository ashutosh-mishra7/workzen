const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const Task = require('../models/Task');

// @desc   Get all projects for current user
// @route  GET /api/projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc   Create project
// @route  POST /api/projects
exports.createProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, status, priority, startDate, dueDate } = req.body;
    try {
        const project = await Project.create({
            title, description, status, priority, startDate, dueDate,
            createdBy: req.user.id
        });
        res.status(201).json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc   Update project
// @route  PUT /api/projects/:id
exports.updateProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        if (project.createdBy.toString() !== req.user.id)
            return res.status(403).json({ message: 'Not authorized' });

        project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc   Delete project
// @route  DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        if (project.createdBy.toString() !== req.user.id)
            return res.status(403).json({ message: 'Not authorized' });

        await Project.findByIdAndDelete(req.params.id);
        await Task.deleteMany({ projectId: req.params.id });
        res.json({ message: 'Project deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc   Get single project
// @route  GET /api/projects/:id
exports.getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        if (project.createdBy.toString() !== req.user.id)
            return res.status(403).json({ message: 'Not authorized' });
        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
