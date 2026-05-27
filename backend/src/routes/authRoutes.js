const express = require('express');
const router = express.Router();
const { login, register, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/login', login);
router.post('/register', register); // Public registration for demo purposes
router.get('/me', protect, getMe);
router.post('/logout', logout);

module.exports = router;
