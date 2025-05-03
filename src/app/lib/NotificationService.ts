type NotificationType = {
  old: string[];
  new: string[];
};

class NotificationsService {
  private lsKey = 'old_notifications';

  getOldNotifications(): NotificationType {
    const raw = localStorage.getItem(this.lsKey);

    return raw ? JSON.parse(raw) : { old: [], new: [] };
  }

  saveNotifications(newNotifications: NotificationType) {
    const currentData: NotificationType = this.getOldNotifications();

    const updatedData: NotificationType = {
      old: Array.from(new Set([...currentData.old, ...newNotifications.old])),
      new: Array.from(new Set([...currentData.new, ...newNotifications.new])),
    };

    localStorage.setItem(this.lsKey, JSON.stringify(updatedData));
  }

  clearNotifications() {
    localStorage.removeItem(this.lsKey);
  }

  expireNotifications() {
    const currentData: NotificationType = this.getOldNotifications();

    const newData: NotificationType = {
      old: Object.values(currentData).flat(),
      new: [],
    };

    localStorage.setItem(this.lsKey, JSON.stringify(newData));
  }
}

export default new NotificationsService();
