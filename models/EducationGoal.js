const mongoose = require('mongoose');

const educationGoalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: [true, 'userId is required'] },
    title: { type: String, required: [true, 'title is required'], trim: true, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    status: {
      type: String,
      enum: { values: ['Not Started', 'In Progress', 'Completed'], message: 'status must be Not Started, In Progress, or Completed' },
      default: 'Not Started'
    },
    institution: { type: String, trim: true, maxlength: 150, default: '' },
    creditsCompleted: { type: Number, min: [0, 'creditsCompleted must be 0 or more'], default: 0 },
    targetDate: { type: Date },
    notes: { type: String, trim: true, maxlength: 2000, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('EducationGoal', educationGoalSchema, 'educationGoals');
