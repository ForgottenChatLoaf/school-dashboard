const express = require('express');
const router = express.Router();
const { saveGrade, getGrades } = require('../controllers/gradeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', authorize('admin', 'teacher'), saveGrade);
router.get('/', getGrades); // Open to all authorized

module.exports = router;
