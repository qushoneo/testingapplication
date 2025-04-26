import { User } from '@/types/User';
import { prisma } from '../lib/prisma';

class UserController {
  async create(user: User) {
    const createdUser = await prisma.user.create({ data: user });

    return createdUser;
  }

  async findById(id: User['id']) {
    const user = await prisma.user.findUnique({ where: { id: id } });

    return user;
  }

  async findByEmail(email: User['email']) {
    const user = await prisma.user.findUnique({ where: { email: email } });

    return user;
  }
}

export default new UserController();
