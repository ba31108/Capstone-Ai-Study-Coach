const express = require('express');
const router = express.Router();
const {
  generateQuizHandler,
  getQuizzes,
  getQuizResults,
  getQuizById,
  submitQuiz,
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/generate', generateQuizHandler);
router.get('/', getQuizzes);
// /results MUST be before /:id to avoid route conflict
router.get('/results', getQuizResults);
router.post('/submit', submitQuiz);
router.get('/:id', getQuizById);

module.exports = router;
