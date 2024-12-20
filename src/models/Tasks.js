const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskId: { type: String, required: true, default: () => Math.random().toString(36).substring(2, 9) },
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'in progress', 'complete'], default: 'pending' },
  dueDate: { type: Date },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }
});

taskSchema.index({ status: 1, dueDate: 1 });

  const Task = mongoose.model('Task', taskSchema);

  module.exports =  Task ;