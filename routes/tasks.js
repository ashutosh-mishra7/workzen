const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const {
    getTasks, createTask, updateTask, deleteTask
} = require('../controllers/taskController');

// GET /api/tasks
router.get('/', auth, getTasks);

// POST /api/tasks
router.post('/', auth, [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('projectId').notEmpty().withMessage('Project is required'),
], createTask);

// PUT /api/tasks/:id
router.put('/:id', auth, updateTask);

// DELETE /api/tasks/:id
router.delete('/:id', auth, deleteTask);

module.exports = router;
