const LectureService = require('../services/lecture');
const { sendSuccess, sendError } = require('../utils/response');

class LectureController {
  async getAllLectures(req, res) {
    try {
      const lectures = await LectureService.getAllLectures();
      sendSuccess(res, lectures);
    } catch (error) {
      sendError(res, error.message);
    }
  }

  async getLecturesByCourse(req, res) {
    try {
      const lectures = await LectureService.getLecturesByCourse(req.params.courseId);
      sendSuccess(res, lectures);
    } catch (error) {
      sendError(res, error.message);
    }
  }

  async getLectureById(req, res) {
    try {
      const lecture = await LectureService.getLectureById(req.params.id);
      if (!lecture) return sendError(res, 'Lecture not found', 404);
      sendSuccess(res, lecture);
    } catch (error) {
      sendError(res, error.message);
    }
  }

  async createLecture(req, res) {
    try {
      const lecture = await LectureService.createLecture(req.body, req.params.courseId);
      sendSuccess(res, lecture, 'Lecture created', 201);
    } catch (error) {
      sendError(res, error.message);
    }
  }

  async updateLecture(req, res) {
    try {
      const lecture = await LectureService.updateLecture(req.params.id, req.body, req.user.id, req.user.role);
      sendSuccess(res, lecture, 'Lecture updated');
    } catch (error) {
      sendError(res, error.message);
    }
  }

  async deleteLecture(req, res) {
    try {
      await LectureService.deleteLecture(req.params.id);
      sendSuccess(res, null, 'Lecture deleted');
    } catch (error) {
      sendError(res, error.message);
    }
  }
}

module.exports = new LectureController();


