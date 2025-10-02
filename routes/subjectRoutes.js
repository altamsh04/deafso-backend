const express = require('express');
const { body } = require('express-validator');
const { addSubject, chatWithSubject, upload, getStudentSubjects } = require('../controllers/subjectController');
const { authenticateTeacher, authenticateStudent } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validationMiddleware');

const router = express.Router();

const addSubjectValidation = [
  body('division')
    .notEmpty()
    .withMessage('Division is required')
    .isString()
    .withMessage('Division must be a string'),
  body('standard')
    .notEmpty()
    .withMessage('Standard is required')
    .isString()
    .withMessage('Standard must be a string'),
  body('subjectName')
    .notEmpty()
    .withMessage('Subject name is required')
    .isString()
    .withMessage('Subject name must be a string')
];

//student subject
const getSubjectsValidation = [
  body('division')
    .notEmpty()
    .withMessage('Division is required')
    .isString()
    .withMessage('Division must be a string'),
  body('standard')
    .notEmpty()
    .withMessage('Standard is required')
    .isString()
    .withMessage('Standard must be a string')
];

const chatValidation = [
  body('subjectId')
    .notEmpty()
    .withMessage('Subject ID is required')
    .isInt({ min: 1 })
    .withMessage('Subject ID must be a positive integer'),
  body('prompt')
    .notEmpty()
    .withMessage('Prompt is required')
    .isString()
    .withMessage('Prompt must be a string')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Prompt must be between 1 and 1000 characters')
];

router.post('/add-subject', 
  authenticateTeacher,
  upload.single('pdf'),
  addSubjectValidation,
  validateRequest,
  addSubject
);

router.post('/chat',
  authenticateStudent,
  chatValidation,
  validateRequest,
  chatWithSubject
);

router.post('/get-student-subjects',
  authenticateStudent,
  getSubjectsValidation,
  validateRequest,
  getStudentSubjects
);

module.exports = router;
