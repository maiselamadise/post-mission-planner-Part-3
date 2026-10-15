const mongoose = require('mongoose');

const careerGoalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: [true, 'userId is required'] },
    title: { type: String, required: [true, 'title is required'], trim: true, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    status: {
      type: String,
      enum: { values: ['Not Started', 'In Progress', 'Completed'], message: 'status must be Not Started, In Progress, or Completed' },
      default: 'Not Started'
    },
    progress: { type: Number, min: [0, 'progress must be 0-100'], max: [100, 'progress must be 0-100'], default: 0 },
    targetDate: { type: Date },
    notes: { type: String, trim: true, maxlength: 2000, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CareerGoal', careerGoalSchema, 'careerGoals');
