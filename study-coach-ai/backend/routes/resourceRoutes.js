const express = require('express');
const router = express.Router();
const { getResources, getResourceById } = require('../controllers/resourceController');

// Public routes — no auth required so students can browse
router.get('/', getResources);
router.get('/:id', getResourceById);

module.exports = router;
