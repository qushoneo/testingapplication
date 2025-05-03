import { createPortal } from 'react-dom';

interface InterfacePortal {
  children: React.ReactElement;
  onClick?: () => void;
}

export default function Portal({ children, onClick }: InterfacePortal) {
  return createPortal(
    <>
      <div
        onClick={onClick}
        className='inset-0 flex items-center justify-center z-50 bg-transparent w-full h-full fixed'
      ></div>
      {children}
    </>,
    document.body
  );
}
