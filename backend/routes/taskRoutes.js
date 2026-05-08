// routes/taskRoutes.js
const express = require('express');
// mergeParams: true is CRITICAL here so it sees :projectId from server.js
const router = express.Router({ mergeParams: true }); 
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTasks);      // GET /api/projects/:projectId/tasks
router.post('/', protect, createTask);    // POST /api/projects/:projectId/tasks
router.put('/:id', protect, updateTask);   // PUT /api/tasks/:id
router.delete('/:id', protect, deleteTask); // DELETE /api/tasks/:id

module.exports = router;