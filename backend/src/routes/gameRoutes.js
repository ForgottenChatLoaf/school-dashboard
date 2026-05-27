const express = require('express');
const router = express.Router();
const { submitQuiz, getMyPoints } = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.post('/submit', submitQuiz);
router.get('/points', getMyPoints);

module.exports = router;
