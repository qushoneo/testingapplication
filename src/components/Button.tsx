'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button as HeadlessButton } from '@headlessui/react';
import Icon, { IconType } from './Icon';

type ButtonProps = {
  label: ReactNode;
  variant?: 'filled' | 'outlined' | 'gray';
  icon?: IconType;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  label,
  disabled,
  className,
  variant = 'filled',
  icon,
  ...props
}: ButtonProps) {
  const variantStyle = {
    filled: 'bg-black',
    outlined: 'bg-transparent border border-black',
    gray: 'bg-gray',
  };

  const textVariantStyle = {
    filled: 'text-white',
    outlined: 'text-black',
    gray: 'text-black',
  };

  return (
    <HeadlessButton
      {...props}
      className={`w-[100%] h-[40px] rounded-[4px] px-[12px] py-[8px] ${
        disabled ? 'bg-disabled border-gray' : 'bg-black'
      } transition-all duration-200 ease-in-out active:scale-[0.95] ${
        variantStyle[variant]
      } ${className}`}
    >
      {
        <div className='flex gap-[12px] justify-center items-center'>
          {icon && <Icon name={icon} />}
          <p className={`font-normal ${textVariantStyle[variant]}`}> {label}</p>
        </div>
      }
    </HeadlessButton>
  );
}
