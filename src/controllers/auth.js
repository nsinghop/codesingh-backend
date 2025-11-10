const AuthService = require('../services/auth');
const { sendSuccess, sendError } = require('../utils/response');

class AuthController {
  async register(req, res) {
    try {
      const result = await AuthService.register(req.body);
      sendSuccess(res, result, 'User registered', 201);
    } catch (error) {
      sendError(res, error.message, 400);
    }
  }

  async login(req, res) {
    try {
      const result = await AuthService.login(req.body.email, req.body.password);
      sendSuccess(res, result, 'Login successful');
    } catch (error) {
      sendError(res, error.message, 401);
    }
  }

  async logout(req, res) {
    sendSuccess(res, null, 'Logout successful');
  }
}

module.exports = new AuthController();


