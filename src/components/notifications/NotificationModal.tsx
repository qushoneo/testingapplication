import NotificationService from '@/app/lib/NotificationService';
import Portal from '../Portal';

type NotificationType = {
  old: string[];
  new: string[];
};

interface NotifcationModalInterface {
  notifications: NotificationType;
  clearNotifications: () => void;
  bellRef: React.RefObject<HTMLDivElement | null>;
  closeModal: () => void;
}

const MODAL_WIDTH = 300;

export default function NortificationModal({
  notifications,
  clearNotifications,
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
        <div onClick={clearNotifications}>
          <p className='text-center bg-[#dadfea] cursor-pointer'>
            Clear notifications
          </p>
        </div>
        <div className='flex flex-col overflow-auto w-full max-w-full'>
          {[
            ...notifications.new.map((el) => ({ text: el, isNew: true })),
            ...notifications.old.map((el) => ({ text: el, isNew: false })),
          ].map((notification, i) => (
            <p
              className={`text-[16px] ${
                notification.isNew ? 'bg-[#e5f2e5]' : 'bg-[#fafafa]'
              } overflow-hidden text-ellipsis px-[8px] line-clamp-2 flex items-center border-b border-[#dadfea]`}
              key={i}
            >
              {notification.text}
            </p>
          ))}
        </div>
      </div>
    </Portal>
  );
}
