const { prisma } = require('../utils/prisma');

class LectureService {
  async getAllLectures() {
    return prisma.lecture.findMany({
      include: { course: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getLecturesByCourse(courseId, page = 1, limit = 20) {
    return prisma.lecture.findMany({ where: { courseId } });
  }

  async getLectureById(id) {
    return prisma.lecture.findUnique({ where: { id } });
  }

  async createLecture(lectureData, courseId) {
    return prisma.lecture.create({ data: { ...lectureData, courseId } });
  }

  async updateLecture(id, updateData, userId, userRole) {
    const lecture = await prisma.lecture.findUnique({ where: { id } });
    if (!lecture) throw new Error('Lecture not found');
    const course = await prisma.course.findUnique({ where: { id: lecture.courseId } });
    if (userRole !== 'admin' && course.instructorId !== userId) throw new Error('Forbidden');
    return prisma.lecture.update({ where: { id }, data: updateData });
  }

  async deleteLecture(id) {
    await prisma.lecture.delete({ where: { id } });
  }
}

module.exports = new LectureService();


