const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', protect, authController.getMe);
router.post('/logout', authController.logout);
router.put('/update-password', protect, authController.updatePassword);
router.put('/preferences', protect, authController.updatePreferences);

module.exports = router;
