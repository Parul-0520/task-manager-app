const express = require('express');
const router = express.Router();
const { getProjects, getProjectById, createProject, updateProject, deleteProject } = require('../controllers/projectController');
// 1. IMPORT the task controllers
const { getTasks, createTask } = require('../controllers/taskController'); 
const { protect } = require('../middleware/authMiddleware');

// Project Routes
router.get('/', protect, getProjects);
router.post('/', protect, createProject);

// 2. ADD Task Routes (Place these BEFORE the general /:id route)
router.get('/:projectId/tasks', protect, getTasks);
router.post('/:projectId/tasks', protect, createTask);

// General Project Routes
router.get('/:id', protect, getProjectById);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;