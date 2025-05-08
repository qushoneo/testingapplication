import Image from 'next/image';
import NotificationBell from '../../../public/assets/notification_bell.svg';
import { memo, useEffect, useRef, useState } from 'react';
import NortificationModal from './NotificationModal';
import { socket } from '@/app/socket';
import { endpoints } from '@/app/api/lib/clientEndpoints';
import { useAuth } from '@/context/AuthProvider';
import NotificationService from '@/app/lib/NotificationService';
import { Notification } from '@prisma/client';
import axios from 'axios';

interface NotificationsInterface {
  className?: string;
}

export const Notifications = memo(
  ({ className = '' }: NotificationsInterface) => {
    const [notificationModalOpen, setNotificationModalOpen] =
      useState<boolean>(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const { user } = useAuth();

    const bellRef = useRef<HTMLDivElement | null>(null);

    const fetchNotifications = async () => {
      if (user) {
        NotificationService.getNotifications(user.id).then((response) =>
          setNotifications(response.data)
        );
      }
    };

    useEffect(() => {
      fetchNotifications();
    }, []);

    const openModal = () => {
      setNotificationModalOpen(true);
    };

    const closeModal = () => {
      setNotificationModalOpen(false);

      NotificationService.markAsRead(notifications.map(({ id }) => id)).then(
        (response) => setNotifications(response.data)
      );
    };

    useEffect(() => {
      socket.emit('register', user);

      socket.on(endpoints.ADD_NOTIFICATION_USER, async () =>
        fetchNotifications()
      );

      return () => {
        socket.off(endpoints.ADD_NOTIFICATION_USER);
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
                notifications.filter((notification) => !notification.read)
                  .length > 0
                  ? 'bg-red'
                  : 'bg-black'
              } rounded-[50%] flex items-center justify-center`}
            >
              <p className='text-[8px] text-white'>
                {notifications.filter((notification) => !notification.read)
                  .length > 0
                  ? notifications.filter((notification) => !notification.read)
                      .length
                  : notifications.length}
              </p>
            </div>
          )}
        </div>

        {notificationModalOpen && bellRef && (
          <NortificationModal
            notifications={notifications}
            bellRef={bellRef}
            closeModal={closeModal}
          />
        )}
      </>
    );
  }
);

Notifications.displayName = 'notificatios';
