const express = require('express');
const router = express.Router();
const { analyzeText, getScanHistory, getScanById } = require('../controllers/analyze.controller');
const { protect } = require('../middleware/auth.middleware');

// FIX: All routes now JWT-protected as per spec
// FIX: GET /history and GET /:id were missing entirely

router.post('/', protect, analyzeText);
router.get('/history', protect, getScanHistory);
router.get('/:id', protect, getScanById);

module.exports = router;
