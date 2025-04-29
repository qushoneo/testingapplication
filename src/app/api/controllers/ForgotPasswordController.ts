import { ForgotPassword } from '@prisma/client';
import { prisma } from '../lib/prisma';

class ForgotPasswordController {
  private generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createCode(userId: ForgotPassword['userId']) {
    const existingForgotPass = await this.findByUserId(userId);

    if (existingForgotPass) {
      const createdCode = await this.replaceCode(userId);

      return createdCode;
    } else {
      const createdCode = await prisma.forgotPassword.create({
        data: {
          validCode: this.generateCode(),
          userId: userId,
        },
      });

      return createdCode;
    }
  }

  async replaceCode(forgotPasswordEmail: ForgotPassword['userId']) {
    const createdCode = await prisma.forgotPassword.update({
      where: {
        userId: forgotPasswordEmail,
      },
      data: {
        validCode: this.generateCode(),
      },
    });

    return createdCode;
  }

  async findByUserId(userId: ForgotPassword['userId']) {
    const forgot_pass = await prisma.forgotPassword.findUnique({
      where: {
        userId: userId,
      },
    });

    return forgot_pass;
  }

  async validateCode(
    userId: ForgotPassword['userId'],
    code: ForgotPassword['validCode']
  ) {
    const validCode = await prisma.forgotPassword.findUnique({
      where: {
        validCode: code,
        userId: userId,
      },
    });

    return validCode;
  }

  async delete(userId: ForgotPassword['userId']) {
    const deletedForgotPassword = await prisma.forgotPassword.delete({
      where: {
        userId: userId,
      },
    });

    return deletedForgotPassword;
  }
}

export default new ForgotPasswordController();
