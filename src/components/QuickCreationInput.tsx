'use client';

import Image from 'next/image';
import { InputHTMLAttributes, useState } from 'react';
import ErrorSign from '@/app/assets/red_error_sign.svg';
import BlackPlus from '@/app/assets/black_plus.svg';

type InputProps = {
  onFinish?: (value: string) => Promise<void>;
  inputClassName?: string;
  errorClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function QuickCreationInput({
  type,
  className,
  onFinish = async () => {},
  inputClassName,
  errorClassName,
  ...props
}: InputProps) {
  const [value, setValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      finishInput();
    }
  };

  const finishInput = () => {
    setErrorMessage('');
    if (value !== '') {
      onFinish(value)
        .then(() => {
          setValue('');
        })
        .catch((e) => {
          setErrorMessage(e.response.data.errors[0].message);
        });
    }
  };

  return (
    <div>
      <div
        className={`flex items-center justify-between items-center ${className}`}
      >
        <Image
          src={BlackPlus}
          alt={props.placeholder || ''}
          className='opacity-[0.5]'
        />

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`w-[100%] h-[20px] border rounded-[4px] px-[12px] py-[4px] text-sm outline-none border-none ${
            errorMessage?.length > 0 ? 'text-red' : ''
          } ${inputClassName}`}
          onFocus={() => setErrorMessage('')}
          onKeyDown={handleKeyDown}
          onBlur={(e) => {
            finishInput();
          }}
          {...props}
        />
      </div>

      {errorMessage.length > 0 && (
        <div
          className={`flex items-center mt-[3px] gap-[3px] ${errorClassName}`}
        >
          <Image src={ErrorSign} className='w-[14px] h-[14px]' alt='error' />
          <p className='text-red text-xs '>{errorMessage}</p>
        </div>
      )}
    </div>
  );
}
