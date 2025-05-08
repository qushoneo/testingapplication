import { User } from '@/types/User';
import { prisma } from '../lib/prisma';
import { userToDTO } from '../lib/userTransferObject';
import bcrypt from 'bcryptjs';

class UserController {
  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async comparePasswords(first_password: string, second_password: string) {
    return await bcrypt.compare(first_password, second_password);
  }

  async create(user: User) {
    const newUserData = { ...user };
    newUserData.password = await this.hashPassword(user.password);

    const createdUser = await prisma.user.create({ data: newUserData });

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

  async changePassword(email: User['email'], password: User['password']) {
    const user = await this.findByEmail(email);

    if (!user) {
      return;
    }

    const updateduser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: await this.hashPassword(password),
      },
    });

    return updateduser;
  }
}

export default new UserController();
