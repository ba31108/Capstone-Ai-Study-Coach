const mongoose = require('mongoose');

const studyPlanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      required: true,
    },
    learningGoal: {
      type: String,
      default: '',
    },
    availableTime: {
      type: String,
      default: '',
    },
    recommendations: {
      type: [String],
      default: [],
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lectureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lecture',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
