const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referencia al modelo 'User'
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

projectSchema.index({ name: 1, description: 1 });

const Project = mongoose.model('Project', projectSchema);

module.exports =  Project ;
