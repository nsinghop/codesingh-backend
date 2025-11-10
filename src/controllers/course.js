const CourseService = require('../services/course');
const { sendSuccess, sendError } = require('../utils/response');

class CourseController {
  async getAllCourses(req, res) {
    try {
      const courses = await CourseService.getAllCourses();
      sendSuccess(res, courses);
    } catch (error) {
      sendError(res, error.message);
    }
  }

  async getCourseById(req, res) {
    try {
      const course = await CourseService.getCourseById(req.params.id);
      if (!course) return sendError(res, 'Course not found', 404);
      sendSuccess(res, course);
    } catch (error) {
      sendError(res, error.message);
    }
  }

  async createCourse(req, res) {
    try {
      const course = await CourseService.createCourse(req.body, req.user.id);
      sendSuccess(res, course, 'Course created', 201);
    } catch (error) {
      sendError(res, error.message);
    }
  }

  async updateCourse(req, res) {
    try {
      const course = await CourseService.updateCourse(req.params.id, req.body, req.user.id, req.user.role);
      sendSuccess(res, course, 'Course updated');
    } catch (error) {
      sendError(res, error.message);
    }
  }

  async deleteCourse(req, res) {
    try {
      await CourseService.deleteCourse(req.params.id);
      sendSuccess(res, null, 'Course deleted');
    } catch (error) {
      sendError(res, error.message);
    }
  }
}

module.exports = new CourseController();


