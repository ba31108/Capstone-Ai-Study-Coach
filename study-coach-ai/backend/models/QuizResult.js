const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: { type: String },
  selectedAnswer: { type: String },
  correctAnswer: { type: String },
  isCorrect: { type: Boolean },
});

const quizResultSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: true,
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
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    answers: [answerSchema],
    weakAreas: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuizResult', quizResultSchema);
