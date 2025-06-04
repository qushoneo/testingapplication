'use client';

import Image from 'next/image';
import { InputHTMLAttributes, useState } from 'react';
import OpenEye from '@/app/../../public/assets/open_eye.svg';
import ClosedEye from '@/app/../../public/assets/closed_eye.svg';
import Check from '@/app/../../public/assets/green_check.svg';
import Cross from '@/app/../../public/assets/red_cross.svg';
import ErrorSign from '@/app/../../public/assets/red_error_sign.svg';
import { Error } from '@/types/Error';
import ErrorComponent from './ErrorComponent';

type InputProps = {
  label?: string;
  showPasswordRequirements?: boolean;
  errors?: Error[];
  placeholderClassName?: string;
  placeholderIcon?: string;
  fieldName: string;
  formClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  label,
  showPasswordRequirements,
  type,
  value = '',
  onChange,
  className = '',
  placeholderClassName = '',
  placeholderIcon,
  errors = [],
  fieldName,
  formClassName,
  ...props
}: InputProps) {
  const [showValue, setShowValue] = useState(true);

  const fieldError = errors.find((error: Error) => error.field === fieldName);

  const switchShowValue = () => {
    setShowValue(!showValue);
  };

  const passwordRequirements = [
    'minimum 8 characters',
    'at least 1 number',
    'at least 1 letter',
  ];

  const validatePassword: { [key: number]: () => boolean } = {
    0: (): boolean => (value as string).length >= 8,
    1: (): boolean => /[0-9]/.test(value as string),
    2: (): boolean => /[a-zA-Z]/.test(value as string),
  };

  const getInputType = () => {
    if (type === 'password' && showValue) {
      return 'password';
    }

    if (type === 'password' && !showValue) {
      return 'text';
    }

    return type;
  };

  return (
    <div
      className={`relative ${formClassName} ${
        errors.length > 0 ? 'mb-[15px]' : ''
      }`}
    >
      <div className='flex items-center justify-between'>
        <p className='text-textPrimary mb-[3px] text-xs'>{label}</p>

        {type === 'password' &&
          (showValue ? (
            <Image
              onClick={switchShowValue}
              src={ClosedEye}
              alt='password-hidden'
              className='cursor-pointer w-[16px]'
            />
          ) : (
            <Image
              onClick={switchShowValue}
              src={OpenEye}
              alt='password-show'
              className='cursor-pointer w-[16px]'
            />
          ))}
      </div>

      {placeholderIcon && (
        <Image
          src={placeholderIcon}
          className='w-[16px] absolute left-[8px] top-[12px]'
          alt='placeholder'
        />
      )}

      <input
        type={getInputType()}
        value={value}
        onChange={onChange}
        className={`
          w-[100%] 
          h-[34px] 
          border 
          rounded-[4px] 
          px-[12px] 
          py-[8px] 
          text-sm 
          placeholder:text-[#1A1A1A]  
          placeholder:font-inter 
          placeholder:text-[14px] 
          placeholder:font-normal 
          placeholder:leading-normal 
          placeholder:opacity-40
          disabled:text-[gray]
          ${fieldError && 'outline-red'}
          ${fieldError ? 'border-red' : 'border-gray'} 
          ${className} 
          ${placeholderIcon ? 'pl-[28px]' : ''} 
          ${placeholderClassName} 
        `}
        {...props}
      />

      {fieldError && (
        <ErrorComponent
          className='absolute absolute bottom-[-18px]'
          errorMessage={fieldError.message}
        />
      )}

      {showPasswordRequirements &&
        (value.toString().length > 0 || fieldError) && (
          <div className='mt-[3px]'>
            {passwordRequirements.map((option, index) => {
              const isValid = validatePassword[index]();
              return (
                <div className='flex items-center gap-[3px]' key={option}>
                  <Image
                    alt={isValid ? 'valid' : 'invalid'}
                    src={isValid ? Check : Cross}
                    className='w-[16px] h-[16px]'
                  />
                  <p
                    className={
                      isValid ? 'text-green text-xs' : 'text-red text-xs'
                    }
                  >
                    {option}
                  </p>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
}
