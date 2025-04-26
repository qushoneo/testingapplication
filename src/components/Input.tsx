'use client';

import Image from 'next/image';
import { InputHTMLAttributes, useState } from 'react';
import OpenEye from '@/app/assets/open_eye.svg';
import ClosedEye from '@/app/assets/closed_eye.svg';
import Check from '@/app/assets/green_check.svg';
import Cross from '@/app/assets/red_cross.svg';
import ErrorSign from '@/app/assets/red_error_sign.svg';
import { Error } from '@/types/Error';

type InputProps = {
  label?: string;
  showPasswordRequirements?: boolean;
  errors?: Error[];
  placeholderClassName?: string;
  placeholderIcon?: string;
  fieldName: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  label,
  showPasswordRequirements,
  type,
  value = '',
  onChange,
  className,
  placeholderClassName,
  placeholderIcon,
  errors = [],
  fieldName,
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
    'at least 1 special symbol',
  ];

  const validatePassword: { [key: number]: () => boolean } = {
    0: (): boolean => (value as string).length >= 8,
    1: (): boolean => /[0-9]/.test(value as string),
    2: (): boolean => /[!@#$%^&*(),.?":{}|<>]/.test(value as string),
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
    <div className='relative'>
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
        className={`w-[100%] h-[34px] border rounded-[4px] px-[12px] py-[8px] text-sm ${
          fieldError ? 'border-red' : 'border-gray'
        } ${className} ${
          placeholderIcon ? 'pl-[28px]' : ''
        } placeholder:text-[#1A1A1A] ${placeholderClassName}  placeholder:font-inter placeholder:text-[14px] placeholder:font-normal placeholder:leading-normal placeholder:opacity-40`}
        {...props}
      />

      {fieldError && (
        <div className='absolute bottom-[-18px] flex items-center mt-[3px] gap-[3px]'>
          <Image src={ErrorSign} className='w-[14px] h-[14px]' alt='error' />
          <p className='text-red text-xs '>{fieldError.message}</p>
        </div>
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
