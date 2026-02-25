const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
    getProjects, createProject, updateProject, deleteProject, getProject
} = require('../controllers/projectController');

// GET /api/projects
router.get('/', auth, getProjects);

// GET /api/projects/:id
router.get('/:id', auth, getProject);

// POST /api/projects
router.post('/', auth, [
    body('title').trim().notEmpty().withMessage('Title is required'),
], createProject);

// PUT /api/projects/:id
router.put('/:id', auth, updateProject);

// DELETE /api/projects/:id
router.delete('/:id', auth, deleteProject);

module.exports = router;
