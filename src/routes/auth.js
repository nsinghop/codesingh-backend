const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth');
const { validate } = require('../middlewares/validate');
const { registerSchema, loginSchema } = require('../validation/auth');

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);

module.exports = router;


