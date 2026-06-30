const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const { generateQuiz } = require('../services/aiService');

// POST /api/quizzes/generate
const generateQuizHandler = async (req, res) => {
  try {
    const { topicId } = req.body;

    if (!topicId) {
      return res.status(400).json({ message: 'topicId is required' });
    }

    const topic = await Topic.findOne({ _id: topicId, userId: req.user._id });
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found or not authorized' });
    }

    const subject = await Subject.findById(topic.subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const questions = generateQuiz(topic, subject);

    const quiz = await Quiz.create({
      title: `Quiz: ${topic.title}`,
      questions,
      topicId: topic._id,
      subjectId: subject._id,
      userId: req.user._id,
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/quizzes
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ userId: req.user._id })
      .populate('topicId', 'title')
      .populate('subjectId', 'name')
      .sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/quizzes/results  — must be before /:id
const getQuizResults = async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id })
      .populate('quizId', 'title')
      .populate('topicId', 'title')
      .populate('subjectId', 'name')
      .sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/quizzes/:id
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('topicId', 'title')
      .populate('subjectId', 'name');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/quizzes/submit
const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    if (!quizId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'quizId and answers array are required' });
    }

    const quiz = await Quiz.findOne({ _id: quizId, userId: req.user._id });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found or not authorized' });
    }

    if (answers.length !== quiz.questions.length) {
      return res.status(400).json({
        message: `Expected ${quiz.questions.length} answers, received ${answers.length}`,
      });
    }

    let score = 0;
    const checkedAnswers = [];
    const weakAreas = [];

    quiz.questions.forEach((q, index) => {
      const selected = answers[index];
      const correct = q.correctAnswer;
      const isCorrect = selected === correct;

      if (isCorrect) {
        score++;
      } else {
        weakAreas.push(q.sourceConcept || q.question);
      }

      checkedAnswers.push({
        question: q.question,
        selectedAnswer: selected,
        correctAnswer: correct,
        isCorrect,
      });
    });

    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    const result = await QuizResult.create({
      quizId: quiz._id,
      topicId: quiz.topicId,
      subjectId: quiz.subjectId,
      userId: req.user._id,
      score,
      totalQuestions,
      percentage,
      answers: checkedAnswers,
      weakAreas,
    });

    // Mark topic as completed if score is high enough
    if (quiz.topicId && percentage >= 70) {
      await Topic.findByIdAndUpdate(quiz.topicId, { status: 'completed' });
    } else if (quiz.topicId) {
      await Topic.findOneAndUpdate(
        { _id: quiz.topicId, status: 'not_started' },
        { status: 'in_progress' }
      );
    }

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateQuizHandler, getQuizzes, getQuizResults, getQuizById, submitQuiz };
