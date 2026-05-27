const express = require('express');
const router = express.Router();
const { 
  getAllStudents, 
  getStudentById, 
  createStudent, 
  updateStudent, 
  deleteStudent 
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect); // All student routes require auth

router.get('/', authorize('admin', 'teacher'), getAllStudents);
router.get('/:id', authorize('admin', 'teacher', 'student'), getStudentById);
router.post('/', authorize('admin'), createStudent);
router.put('/:id', authorize('admin'), updateStudent);
router.delete('/:id', authorize('admin'), deleteStudent);

module.exports = router;
