const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getStats,
  getStudents,
  getStudentById,
  getAdminResources,
  createResource,
  updateResource,
  deleteResource,
  patchResourceStatus,
} = require('../controllers/adminController');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/students', getStudents);
router.get('/students/:id', getStudentById);

router.get('/resources', getAdminResources);
router.post('/resources', createResource);
router.put('/resources/:id', updateResource);
router.delete('/resources/:id', deleteResource);
router.patch('/resources/:id/status', patchResourceStatus);

module.exports = router;
