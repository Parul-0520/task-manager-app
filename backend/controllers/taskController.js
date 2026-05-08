const Task = require('../models/Task');
const Project = require('../models/Project');

const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    // Correct: Find all tasks belonging to this project
    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// backend/controllers/taskController.js
const createTask = async (req, res) => {
  try {
    // 1. ADD 'dueDate' to the destructuring here
    const { title, description, priority, assignedTo, dueDate } = req.body;
    const { projectId } = req.params; 

    const task = await Task.create({
      title,
      description,
      priority,
      assignedTo: assignedTo || null,
      dueDate, // 2. ADD 'dueDate' to the object here
      project: projectId, 
      createdBy: req.user._id
    });

    // Automatically add assigned user to project members
    if (assignedTo) {
      await Project.findByIdAndUpdate(projectId, {
        $addToSet: { members: assignedTo } 
      });
    }

    res.status(201).json(task);
  } catch (error) {
    // This will catch the missing dueDate or any other validation errors
    res.status(400).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Simple status update
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status }, 
      { new: true }
    );
    
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };