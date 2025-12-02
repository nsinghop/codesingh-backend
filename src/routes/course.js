const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/course');
const LectureController = require('../controllers/lecture');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const { validate } = require('../middlewares/validate');
const { createCourseSchema, updateCourseSchema } = require('../validation/course');
const { createLectureSchema } = require('../validation/lecture');

router.get('/', CourseController.getAllCourses);
// router.post('/', authenticate, authorize('instructor', 'admin'), validate(createCourseSchema), CourseController.createCourse);
router.post('/', authenticate, authorize('instructor', 'admin'), CourseController.createCourse);
router.get('/:id', CourseController.getCourseById);
router.put('/:id', authenticate, authorize('instructor', 'admin'), validate(updateCourseSchema), CourseController.updateCourse);
router.delete('/:id', authenticate, authorize('admin'), CourseController.deleteCourse);

router.get('/:courseId/lectures', LectureController.getLecturesByCourse);
router.post('/:courseId/lectures', authenticate, authorize('instructor', 'admin'), validate(createLectureSchema), LectureController.createLecture);

module.exports = router;


