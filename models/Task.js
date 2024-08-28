const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  date: { type: Date}  // Adding the date field
});

module.exports = mongoose.model('Task', TaskSchema);
