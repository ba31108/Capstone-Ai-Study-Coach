const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { handlePdfUpload } = require('../middleware/uploadMiddleware');
const {
  uploadLecture,
  getLectures,
  getLectureById,
  deleteLecture,
  generateLectureQuiz,
  generateLectureStudyPlan,
} = require('../controllers/lectureController');

router.use(protect);

router.get('/', getLectures);
router.post('/upload', handlePdfUpload, uploadLecture);
router.get('/:id', getLectureById);
router.delete('/:id', deleteLecture);
router.post('/:id/generate-quiz', generateLectureQuiz);
router.post('/:id/generate-study-plan', generateLectureStudyPlan);

module.exports = router;
