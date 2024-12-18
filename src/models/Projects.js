const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Relación con Usuario
    createdAt: { type: Date, default: Date.now },
  }, { timestamps: true });
  
  const Project = mongoose.model('Project', projectSchema);

  module.exports = {  Project };