const mongoose = require('mongoose');

const spiritualGoalSchema = new mongoose.Schema(
  {
    // Becomes an ownership check once login is added in Week 06
    userId: { type: mongoose.Schema.Types.ObjectId, required: [true, 'userId is required'] },
    title: { type: String, required: [true, 'title is required'], trim: true, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    status: {
      type: String,
      enum: { values: ['Not Started', 'In Progress', 'Completed'], message: 'status must be Not Started, In Progress, or Completed' },
      default: 'Not Started'
    },
    targetDate: { type: Date },
    notes: { type: String, trim: true, maxlength: 2000, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SpiritualGoal', spiritualGoalSchema, 'spiritualGoals');
