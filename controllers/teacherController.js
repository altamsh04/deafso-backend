const { prisma } = require('../config/database');

const getTeacherClasses = async (teacherId) => {
  return await prisma.subject.findMany({
    where: { teacherId: parseInt(teacherId) },
    select: {
      division: true,
      standard: true,
      subjectName: true,
      subjectId: true
    }
  });
};

module.exports = {
    getTeacherClasses
};