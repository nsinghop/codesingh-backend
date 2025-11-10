const express = require('express');
const router = express.Router();
const LectureController = require('../controllers/lecture');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const { validate } = require('../middlewares/validate');
const { updateLectureSchema } = require('../validation/lecture');

router.get('/', authenticate, authorize('admin', 'instructor'), LectureController.getAllLectures);
router.get('/:id', LectureController.getLectureById);
router.put('/:id', authenticate, authorize('instructor', 'admin'), validate(updateLectureSchema), LectureController.updateLecture);
router.delete('/:id', authenticate, authorize('admin'), LectureController.deleteLecture);

module.exports = router;


