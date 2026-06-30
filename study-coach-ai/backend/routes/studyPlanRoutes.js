const express = require('express');
const router = express.Router();
const {
  generateStudyPlanHandler,
  getStudyPlans,
  getStudyPlanById,
  deleteStudyPlan,
} = require('../controllers/studyPlanController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/generate', generateStudyPlanHandler);
router.get('/', getStudyPlans);
router.route('/:id').get(getStudyPlanById).delete(deleteStudyPlan);

module.exports = router;
