const { prisma } = require('../config/database');

// Get Student Profile
const getStudentProfile = async (req, res) => {
  try {
    const { studentID } = req.params;

    // Get student profile with proper validation
    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentID) },
      select: {
        id: true,
        fullname: true,
        email: true,
        mobile: true,
        standard: true,
        division: true,
        rollnumber: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student profile retrieved successfully',
      data: {
        id: student.id,
        fullname: student.fullname,
        email: student.email,
        mobile: student.mobile,
        standard: student.standard,
        division: student.division,
        rollnumber: student.rollnumber,
        created_at: student.createdAt,
        updated_at: student.updatedAt
      }
    });
  } catch (error) {
    console.error('Get student profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


// Get Teacher Profile (additional endpoint)
const getTeacherProfile = async (req, res) => {
  try {
    const { teacherID } = req.params;

    // Get teacher profile
    const teacher = await prisma.teacher.findUnique({
      where: { id: parseInt(teacherID) },
      select: {
        id: true,
        fullname: true,
        email: true,
        mobile: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Teacher profile retrieved successfully',
      data: {
        id: teacher.id,
        fullname: teacher.fullname,
        email: teacher.email,
        mobile: teacher.mobile,
        created_at: teacher.createdAt,
        updated_at: teacher.updatedAt
      }
    });
  } catch (error) {
    console.error('Get teacher profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get All Students in a Class (additional endpoint)
const getStudentsInClass = async (req, res) => {
  try {
    const { standard, division } = req.params;

    const students = await prisma.student.findMany({
      where: {
        standard: standard,
        division: division
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        mobile: true,
        rollnumber: true,
        createdAt: true
      },
      orderBy: {
        rollnumber: 'asc'
      }
    });

    res.status(200).json({
      success: true,
      message: 'Students in class retrieved successfully',
              data: students.map(student => ({
          ...student,
          created_at: student.createdAt
        })),
      count: students.length
    });
  } catch (error) {
    console.error('Get students in class error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getStudentProfile,
  getTeacherProfile,
  getStudentsInClass
}; 