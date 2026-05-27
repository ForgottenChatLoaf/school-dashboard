const express = require('express');
const router = express.Router();
const { logAttendance, getAttendance, getAttendanceSummary } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/', authorize('admin', 'teacher'), logAttendance);
router.get('/', getAttendance); // Open to all authorized
router.get('/summary/:studentId', getAttendanceSummary); // Open to all authorized

module.exports = router;
