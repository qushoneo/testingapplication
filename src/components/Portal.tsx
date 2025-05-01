import { createPortal } from 'react-dom';

export default function Portal({ children }) {
  return createPortal(
    <div className='inset-0 flex items-center justify-center z-50 bg-transparent '>
      {children}
    </div>,
    document.body
  );
}
