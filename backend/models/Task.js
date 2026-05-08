const mongoose = require('mongoose');

// backend/models/Task.js
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  // Ensure this name matches what you use in the controller!
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, 
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date']
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo'
  }

}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);