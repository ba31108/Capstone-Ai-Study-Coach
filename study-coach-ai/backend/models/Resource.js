const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Mathematics', 'Biology', 'English', 'Computer Science', 'Science', 'History', 'Elementary Basics'],
    },
    level: {
      type: String,
      required: [true, 'Level is required'],
      enum: ['Elementary', 'Beginner', 'High School', 'Intermediate', 'University', 'Advanced', 'All Levels'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    keyPoints: {
      type: [String],
      default: [],
    },
    recommendedPractice: {
      type: [String],
      default: [],
    },
    estimatedReadingTime: {
      type: String,
      default: '~20 min',
    },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'draft',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
