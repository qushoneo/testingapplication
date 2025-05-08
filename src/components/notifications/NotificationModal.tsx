import NotificationService from '@/app/lib/NotificationService';
import Portal from '../Portal';
import { Notification } from '@prisma/client';

interface NotifcationModalInterface {
  notifications: Notification[];
  bellRef: React.RefObject<HTMLDivElement | null>;
  closeModal: () => void;
}

const MODAL_WIDTH = 300;

export default function NotifcationModal({
  notifications,
  bellRef,
  closeModal,
}: NotifcationModalInterface) {
  if (!bellRef.current) {
    return <></>;
  }

  return (
    <Portal onClick={closeModal}>
      <div
        className={`w-[${MODAL_WIDTH}px] h-[300px] bg-[white] absolute z-[100] border border-gray rounded overflow-auto`}
        style={{
          top: 55,
          left: bellRef.current.getBoundingClientRect().left - MODAL_WIDTH / 2,
        }}
      >
        <div className='flex flex-col overflow-y-auto overflow-x-hidden w-full max-w-full'>
          {notifications
            .toSorted((a, b) =>
              new Date(a.createdAt).getTime() < new Date(a.createdAt).getTime()
                ? 1
                : -1
            )
            .map((notification, i) => (
              <div
                key={notification.id}
                className='w-full flex items-center px-[8px] border-b border-[#dadfea] gap-[4px]'
              >
                {!notification.read && (
                  <div className='min-w-[8px] min-h-[8px] rounded-[50%] bg-green' />
                )}
                <p
                  className={`text-[16px] py-[10px] truncate`}
                  style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {notification.message}
                </p>
              </div>
            ))}
        </div>
      </div>
    </Portal>
  );
}
