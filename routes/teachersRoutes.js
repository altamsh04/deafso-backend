const express = require('express');
const router = express.Router();
const { authenticateTeacher } = require('../middleware/authMiddleware');
const { 
  validateSubject, 
  validateSubjectUpdate, 
  validateSubjectId 
} = require('../middleware/validationMiddleware');
const {
  addSubject,
  getTeacherSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
} = require('../controllers/teacherController');

// Add a new subject
router.post('/subjects', authenticateTeacher, validateSubject, addSubject);

// Get all subjects for the authenticated teacher
router.get('/subjects', authenticateTeacher, getTeacherSubjects);

// Get a specific subject by ID
router.get('/subjects/:subjectId', authenticateTeacher, validateSubjectId, getSubjectById);

// Update a subject
router.put('/subjects/:subjectId', authenticateTeacher, validateSubjectId, validateSubjectUpdate, updateSubject);

// Delete a subject
router.delete('/subjects/:subjectId', authenticateTeacher, validateSubjectId, deleteSubject);

module.exports = router;
