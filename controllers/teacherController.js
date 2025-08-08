const { prisma } = require('../config/database');

// Add a new subject
const addSubject = async (req, res) => {
  try {
    const { subjectName, standard, division, duration, content } = req.body;
    const teacherId = req.teacher.id;
    
    // Check if subject already exists for this standard and division
    const existingSubject = await prisma.subject.findFirst({
      where: {
        subjectName,
        standard,
        division
      }
    });

    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: 'Subject already exists for this standard and division'
      });
    }

    // Create new subject
    const newSubject = await prisma.subject.create({
      data: {
        subjectName,
        standard,
        division,
        duration: duration || 0,
        content: content || null,
        teacherId // Use the teacherId from authenticated session
      },
      include: {
        teacher: {
          select: {
            id: true,
            fullname: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Subject added successfully',
      data: {
        id: newSubject.id,
        subjectName: newSubject.subjectName,
        standard: newSubject.standard,
        division: newSubject.division,
        duration: newSubject.duration,
        content: newSubject.content,
        teacher: newSubject.teacher
      }
    });
  } catch (error) {
    console.error('Error adding subject:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all subjects for a teacher
const getTeacherSubjects = async (req, res) => {
  try {
    const teacherId = req.teacher.id;

    const subjects = await prisma.subject.findMany({
      where: {
        teacherId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        teacher: {
          select: {
            id: true,
            fullname: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Subjects retrieved successfully',
      data: subjects
    });
  } catch (error) {
    console.error('Error getting teacher subjects:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get subject by ID
const getSubjectById = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const teacherId = req.teacher.id;

    const subject = await prisma.subject.findFirst({
      where: {
        id: parseInt(subjectId),
        teacherId
      },
      include: {
        teacher: {
          select: {
            id: true,
            fullname: true,
            email: true
          }
        }
      }
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subject retrieved successfully',
      data: subject
    });
  } catch (error) {
    console.error('Error getting subject:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update subject
const updateSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { subjectName, standard, division, duration, content } = req.body;
    const teacherId = req.teacher.id;

    // Check if subject exists and belongs to teacher
    const existingSubject = await prisma.subject.findFirst({
      where: {
        id: parseInt(subjectId),
        teacherId
      }
    });

    if (!existingSubject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Check if new subject name already exists for this standard and division
    if (subjectName && (subjectName !== existingSubject.subjectName || standard !== existingSubject.standard || division !== existingSubject.division)) {
      const duplicateSubject = await prisma.subject.findFirst({
        where: {
          subjectName,
          standard,
          division,
          id: { not: parseInt(subjectId) }
        }
      });

      if (duplicateSubject) {
        return res.status(400).json({
          success: false,
          message: 'Subject already exists for this standard and division'
        });
      }
    }

    // Update subject
    const updatedSubject = await prisma.subject.update({
      where: {
        id: parseInt(subjectId)
      },
      data: {
        subjectName: subjectName || existingSubject.subjectName,
        standard: standard || existingSubject.standard,
        division: division || existingSubject.division,
        duration: duration !== undefined ? duration : existingSubject.duration,
        content: content !== undefined ? content : existingSubject.content
      },
      include: {
        teacher: {
          select: {
            id: true,
            fullname: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: updatedSubject
    });
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete subject
const deleteSubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const teacherId = req.teacher.id;

    // Check if subject exists and belongs to teacher
    const existingSubject = await prisma.subject.findFirst({
      where: {
        id: parseInt(subjectId),
        teacherId
      }
    });

    if (!existingSubject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }

    // Delete subject
    await prisma.subject.delete({
      where: {
        id: parseInt(subjectId)
      }
    });

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  addSubject,
  getTeacherSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
};
