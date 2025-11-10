const { prisma } = require('../utils/prisma');
const bcrypt = require('bcryptjs');

class UserService {
  async getAllUsers(page = 1, limit = 10, role) {
    const where = role ? { role } : undefined;
    return prisma.user.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async getUserById(id) {
    return prisma.user.findUnique({ where: { id } });
  }

  async updateUser(id, updateData) {
    const data = { ...updateData };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id) {
    await prisma.user.delete({ where: { id } });
  }
}

module.exports = new UserService();


