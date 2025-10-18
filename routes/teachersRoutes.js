const express = require('express');
const { authenticateTeacher } = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/:teacherId/classes',
  authenticateTeacher,
  async (req, res) => {
    const { teacherId } = req.params;
    try {
      const classes = await require('../controllers/teacherController').getTeacherClasses(teacherId);
      return res.status(200).json({ success: true, data: classes });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
  }
);

module.exports = router;