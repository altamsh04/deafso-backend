const { body, param, validationResult } = require('express-validator');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

// Student signup validation
const validateStudentSignup = [
  body('fullname')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Full name must be between 2 and 255 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('mobile')
    .matches(/^[0-9]{10}$/)
    .withMessage('Mobile number must be 10 digits'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('standard')
    .isIn(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])
    .withMessage('Standard must be between 1 and 12'),
  body('division')
    .isLength({ min: 1, max: 5 })
    .withMessage('Division must be between 1 and 5 characters'),
  body('rollnumber')
    .isLength({ min: 1, max: 20 })
    .withMessage('Roll number must be between 1 and 20 characters'),
  handleValidationErrors
];

// Student login validation
const validateStudentLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Teacher signup validation
const validateTeacherSignup = [
  body('fullname')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Full name must be between 2 and 255 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('mobile')
    .matches(/^[0-9]{10}$/)
    .withMessage('Mobile number must be 10 digits'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

// Teacher login validation
const validateTeacherLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Student ID parameter validation
const validateStudentId = [
  param('studentID')
    .isInt({ min: 1 })
    .withMessage('Student ID must be a positive integer'),
  handleValidationErrors
];

// Standard and division parameter validation
const validateStandardDivision = [
  param('standard')
    .isIn(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])
    .withMessage('Standard must be between 1 and 12'),
  param('division')
    .isLength({ min: 1, max: 5 })
    .withMessage('Division must be between 1 and 5 characters'),
  handleValidationErrors
];

// Subject validation
const validateSubject = [
  body('subjectName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Subject name must be between 2 and 100 characters'),
  body('standard')
    .isIn(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])
    .withMessage('Standard must be between 1 and 12'),
  body('division')
    .isLength({ min: 1, max: 5 })
    .withMessage('Division must be between 1 and 5 characters'),
  body('duration')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Duration must be a non-negative integer'),
  body('content')
    .optional()
    .isLength({ max: 10000 })
    .withMessage('Content must be less than 10000 characters'),
  handleValidationErrors
];

// Subject update validation
const validateSubjectUpdate = [
  body('subjectName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Subject name must be between 2 and 100 characters'),
  body('standard')
    .optional()
    .isIn(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'])
    .withMessage('Standard must be between 1 and 12'),
  body('division')
    .optional()
    .isLength({ min: 1, max: 5 })
    .withMessage('Division must be between 1 and 5 characters'),
  body('duration')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Duration must be a non-negative integer'),
  body('content')
    .optional()
    .isLength({ max: 10000 })
    .withMessage('Content must be less than 10000 characters'),
  handleValidationErrors
];

// Subject ID parameter validation
const validateSubjectId = [
  param('subjectId')
    .isInt({ min: 1 })
    .withMessage('Subject ID must be a positive integer'),
  handleValidationErrors
];

module.exports = {
  validateStudentSignup,
  validateStudentLogin,
  validateTeacherSignup,
  validateTeacherLogin,
  validateStudentId,
  validateStandardDivision,
  validateSubject,
  validateSubjectUpdate,
  validateSubjectId,
  handleValidationErrors
}; 