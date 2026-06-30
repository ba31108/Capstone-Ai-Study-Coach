const express = require('express');
const router = express.Router();
const {
  createTopic,
  getTopics,
  getTopicsBySubject,
  getTopicById,
  updateTopic,
  deleteTopic,
} = require('../controllers/topicController');
const {
  getLecturesByTopic,
  uploadLectureToTopic,
  generateLectureQuiz,
  generateLectureStudyPlan,
} = require('../controllers/lectureController');
const { protect } = require('../middleware/authMiddleware');
const { handlePdfUpload } = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/').get(getTopics).post(createTopic);
router.get('/subject/:subjectId', getTopicsBySubject);
router.route('/:id').get(getTopicById).put(updateTopic).delete(deleteTopic);

// Topic-scoped lecture routes
router.get('/:topicId/lectures', getLecturesByTopic);
router.post('/:topicId/lectures/upload', handlePdfUpload, uploadLectureToTopic);

module.exports = router;
