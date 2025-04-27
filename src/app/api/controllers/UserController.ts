import { User } from '@/types/User';
import { prisma } from '../lib/prisma';
import { userToDTO } from '../lib/userTransferObject';

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

  async getAll(companyId: User['companyId']) {
    const users = await prisma.user.findMany({
      where: {
        companyId: companyId,
      },
    });

    return users.map((user) => userToDTO(user));
  }
}

export default new UserController();
