const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');
const courseRoutes = require('./course');
const lectureRoutes = require('./lecture');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/lectures', lectureRoutes);

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'EdTech API is running', timestamp: new Date().toISOString() });
});

module.exports = router;


