const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, // Relación con Proyecto
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Relación con Usuario
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    assignedTo: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: false,},
    createdAt: { type: Date, default: Date.now },
  }, { timestamps: true });
  
  const Task = mongoose.model('Task', taskSchema);

  module.exports = {  Task };