import { Company, Notification, User } from '@prisma/client';
import { prisma } from '../lib/prisma';
import UserController from './UserController';

class NotificationController {
  async getByUserId(userId: User['id']) {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: Number(userId),
      },
    });

    return notifications;
  }

  async makeRead(notificationIds: Notification['id'][]) {
    const notifications = await prisma.notification.updateManyAndReturn({
      where: {
        id: {
          in: notificationIds,
        },
      },
      data: {
        read: true,
      },
    });

    return notifications;
  }

  async create(notification: Pick<Notification, 'message' | 'userId'>) {
    const createdNotificaiotn = await prisma.notification.create({
      data: {
        message: notification.message,
        userId: notification.userId,
      },
    });

    return createdNotificaiotn;
  }

  async createForCompany(
    notification: Pick<Notification, 'message' | 'userId'>,
    companyId: Company['id']
  ) {
    const companyUserIds = UserController.getAll(companyId);

    const createdNotificaiotn = await prisma.notification.create({
      data: {
        message: notification.message,
        userId: notification.userId,
      },
    });

    return createdNotificaiotn;
  }
}

export default new NotificationController();
