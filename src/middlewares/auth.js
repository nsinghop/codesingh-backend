const { verifyAccessToken } = require('../utils/jwt');
const { sendError } = require('../utils/response');
const { prisma } = require('../utils/prisma');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'No token provided', 401);
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return sendError(res, 'User not found', 404);
    }
    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired token', 401);
  }
};

module.exports = { authenticate };


