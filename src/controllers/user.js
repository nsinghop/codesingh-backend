const UserService = require('../services/user');
const { sendSuccess, sendError } = require('../utils/response');
const AuthService = require('../services/auth');

class UserController {
  async getAllUsers(req, res) {
    try {
      const role = req.query.role;
      const users = await UserService.getAllUsers(undefined, undefined, role);
      sendSuccess(res, users);
    } catch (error) {
      sendError(res, error.message);
    }
  }

  async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) return sendError(res, 'User not found', 404);
      sendSuccess(res, user);
    } catch (error) {
      sendError(res, error.message);
    }
  }

  async updateUser(req, res) {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      sendSuccess(res, user, 'User updated');
    } catch (error) {
      sendError(res, error.message);
    }
  }

  async deleteUser(req, res) {
    try {
      await UserService.deleteUser(req.params.id);
      sendSuccess(res, null, 'User deleted');
    } catch (error) {
      sendError(res, error.message);
    }
  }

  async createUser(req, res) {
    try {
      const created = await AuthService.register(req.body);
      sendSuccess(res, created, 'User created', 201);
    } catch (error) {
      sendError(res, error.message, 400);
    }
  }
}

module.exports = new UserController();


