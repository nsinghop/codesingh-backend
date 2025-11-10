const { prisma } = require('../utils/prisma');

class CourseService {
  async getAllCourses(page = 1, limit = 10) {
    return prisma.course.findMany({
      include: { instructor: true, lectures: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getCourseById(id) {
    return prisma.course.findUnique({
      where: { id },
      include: { instructor: true, lectures: true }
    });
  }

  async createCourse(courseData, instructorId) {
    return prisma.course.create({ data: { ...courseData, instructorId } });
  }

  async updateCourse(id, updateData, userId, userRole) {
    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) throw new Error('Course not found');
    if (userRole !== 'admin' && course.instructorId !== userId) throw new Error('Forbidden');
    return prisma.course.update({ where: { id }, data: updateData });
  }

  async deleteCourse(id) {
    await prisma.course.delete({ where: { id } });
  }
}

module.exports = new CourseService();


