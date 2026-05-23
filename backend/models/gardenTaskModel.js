const mongoose = require('mongoose');

const gardenTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  isCompleted: { type: Boolean, default: false },
  dueDate: { type: Date },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // --- New AI & Context Fields ---
  taskType: { 
    type: String, 
    enum: ['water', 'fertilize', 'prune', 'harvest', 'pest-control', 'custom'],
    default: 'custom'
  },
  aiGenerated: { type: Boolean, default: false },
  aiReasoning: { type: String },
  relatedPlant: { type: mongoose.Schema.Types.ObjectId, ref: 'TrackedPlant' },
  weatherDependent: { type: Boolean, default: false },
  language: { type: String, default: 'en' },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GardenTask', gardenTaskSchema);
