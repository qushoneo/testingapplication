import { createPortal } from 'react-dom';
import './styles.css';

interface LoadingProps {
  fullScreen?: boolean;
  offset?: {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
  };
}

export default function Loading({ fullScreen = false, offset }: LoadingProps) {
  if (fullScreen) {
    return createPortal(
      <div
        style={{ ...offset }}
        className='inset-0 flex items-center justify-center z-50 bg-transparent '
      >
        <div className='spinner animate-spin' />
      </div>,
      document.body
    );
  }

  return <div className='spinner animate-spin' />;
}
