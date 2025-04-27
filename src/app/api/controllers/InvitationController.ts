import { Invitation } from '@prisma/client';
import { prisma } from '../lib/prisma';

class InvitationController {
  async create(email: Invitation['email'], companyId: Invitation['companyId']) {
    const invitation = await prisma.invitation.create({
      data: { email, companyId },
      include: {
        company: true,
      },
    });

    return invitation;
  }

  async getById(id: Invitation['id']) {
    const invitation = await prisma.invitation.findUnique({
      where: {
        id: id,
      },
      include: {
        company: true,
      },
    });

    return invitation;
  }
}

export default new InvitationController();
