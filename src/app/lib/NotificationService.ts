import { Notification } from '@prisma/client';
import axios from 'axios';

class NotificationsService {
  async getNotifications(userId: Notification['userId']) {
    return await axios.get('/api/notifications/' + userId);
  }

  async markAsRead(ids: Notification['id'][]) {
    return await axios.post('/api/notifications', { ids: ids });
  }
}

export default new NotificationsService();
