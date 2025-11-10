const bcrypt = require('bcryptjs');
const { prisma } = require('../utils/prisma');

const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

class AuthService {
  async register(userData) {
    const { username, email, password, role } = userData;
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) throw new Error('Email already registered Sir');

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { username, email, password: hashed, role } });
    
    return { id: user.id, username: user.username, email: user.email, role: user.role };
  }

  async login(email, password) {

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error('Email Not Registered');

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new Error('Invalid Password');

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role });
    return {
      accessToken,
      refreshToken,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    };
  }
}

module.exports = new AuthService();


