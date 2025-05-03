import Image from 'next/image';
import NotificationBell from '@/../../public/assets/notification_bell.svg';
import { memo, useEffect, useRef, useState } from 'react';
import NortificationModal from './NotificationModal';
import { socket } from '@/app/socket';
import { endpoints } from '@/app/api/lib/clientEndpoints';
import { useAuth } from '@/context/AuthProvider';
import NotificationService from '@/app/lib/NotificationService';

interface NotificationsInterface {
  className?: string;
}

type NotificationType = {
  old: string[];
  new: string[];
};

export const Notifications = memo(
  ({ className = '' }: NotificationsInterface) => {
    const [notifications, setNotifications] = useState<NotificationType>(
      NotificationService.getOldNotifications()
    );
    const [notificationModalOpen, setNotificationModalOpen] =
      useState<boolean>(false);

    const { user } = useAuth();

    const bellRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      NotificationService.saveNotifications(notifications);
    }, [notifications]);

    const openModal = () => {
      setNotificationModalOpen(true);
    };

    const clearNotifications = () => {
      NotificationService.clearNotifications();
      setNotifications({
        old: [],
        new: [],
      });
    };

    const closeModal = () => {
      setNotificationModalOpen(false);

      const expiredNotifications: NotificationType = {
        old: Object.values(notifications).flat(),
        new: [],
      };

      setNotifications(expiredNotifications);

      NotificationService.expireNotifications();
    };

    useEffect(() => {
      socket.emit('register', user?.companyId);

      socket.on(endpoints.ADD_NOTIFICATION, (socketData: { text: string }) => {
        setNotifications((pr: NotificationType) => ({
          old: pr.old,
          new: [...pr.new, socketData.text],
        }));
      });

      return () => {
        socket.off(endpoints.CREATE_PROJECT);
        socket.off(endpoints.DELETE_PROJECT);
      };
    }, []);

    return (
      <>
        <div
          onClick={openModal}
          className={`${className} relative`}
          ref={bellRef}
          style={{
            display:
              Object.values(notifications).flat().length > 0 ? 'block' : 'none',
          }}
        >
          <Image
            src={NotificationBell}
            className='cursor-pointer'
            alt='notifications'
          />

          {Object.values(notifications).flat().length > 0 && (
            <div
              className={`w-[12px] h-[12px] absolute right-[0px] top-[0px] ${
                notifications.new.length > 0 ? 'bg-red' : 'bg-yellow'
              } rounded-[50%] flex items-center justify-center`}
            >
              <p className='text-[8px] text-white'>
                {notifications.new.length > 0
                  ? notifications.new.length
                  : notifications.old.length}
              </p>
            </div>
          )}
        </div>

        {notificationModalOpen && bellRef && (
          <NortificationModal
            notifications={notifications}
            clearNotifications={clearNotifications}
            bellRef={bellRef}
            closeModal={closeModal}
          />
        )}
      </>
    );
  }
);

Notifications.displayName = 'notificatios';
