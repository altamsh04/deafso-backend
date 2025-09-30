const express = require('express');
const router = express.Router();

const {
  getStudentProfile,
  getTeacherProfile,
  getStudentsInClass
} = require('../controllers/dashboardController');

const {
  authenticateStudent,
  authenticateTeacher
} = require('../middleware/authMiddleware');

const {
  validateStudentId,
  validateStandardDivision
} = require('../middleware/validationMiddleware');

// Student Dashboard Routes (protected)
router.get('/student/profile/:studentID', authenticateStudent, validateStudentId, getStudentProfile);

// Teacher Dashboard Routes (protected)
router.get('/teacher/profile/:teacherID', authenticateTeacher, getTeacherProfile);

// Additional Routes (can be accessed by both students and teachers)
router.get('/class/:standard/:division/students', validateStandardDivision, getStudentsInClass);

module.exports = router; 