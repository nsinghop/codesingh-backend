const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const { authenticate } = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');
const { validate } = require('../middlewares/validate');
const { registerSchema } = require('../validation/auth');

router.get('/', authenticate, authorize('admin'), UserController.getAllUsers);
router.get('/:id', authenticate, UserController.getUserById);
router.put('/:id', authenticate, UserController.updateUser);
router.delete('/:id', authenticate, authorize('admin'), UserController.deleteUser);

// admin create user
router.post('/', authenticate, authorize('admin'), validate(registerSchema), UserController.createUser);

// admin routes for user statistics (placeholder mirrors old route target)
router.get('/admin/stats', authenticate, authorize('admin'), UserController.getAllUsers);

module.exports = router;


