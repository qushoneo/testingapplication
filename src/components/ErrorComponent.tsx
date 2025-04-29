import Image from 'next/image';
import ErrorSign from '@/app/../../public/assets/red_error_sign.svg';

interface ErrorProps {
  errorMessage: string;
  className?: string;
}

export default function ErrorComponent({
  errorMessage,
  className = '',
}: ErrorProps) {
  return (
    <div className={`flex items-center mt-[3px] gap-[3px] ${className}`}>
      <Image src={ErrorSign} className='w-[14px] h-[14px]' alt='error' />
      <p className='text-red text-xs '>{errorMessage}</p>
    </div>
  );
}
