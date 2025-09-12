'use client';

import { Button as HeadlessButton } from '@headlessui/react';
import Icon, { IconType } from './Icon';
import { ButtonHTMLAttributes } from 'react';

type StatusButtonProps = {
  status: 'InProgress' | 'Failed' | 'Passed';
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const statusConfig = {
  InProgress: {
    icon: 'loading' as IconType,
    label: 'In progress',
    styles: 'bg-inProgress hover:opacity-90',
  },
  Failed: {
    icon: 'small_black_cross' as IconType,
    label: 'Failed',
    styles: 'bg-failed hover:opacity-90',
  },
  Passed: {
    icon: 'black_check' as IconType,
    label: 'Passed',
    styles: 'bg-passed hover:opacity-90',
  },
} as const;

export default function StatusButton({
  status = 'InProgress',
  className = '',
  ...props
}: StatusButtonProps) {
  const config = statusConfig[status];

  return (
    <HeadlessButton
      {...props}
      className={`flex items-center  py-[4px] px-[8px] rounded-[4px] ${config.styles} ${className}`}
    >
      <div className='flex items-center gap-[4px]'>
        <Icon name={config.icon} size={14} />
        <p className='text-[12px] text-textPrimary'>{config.label}</p>
      </div>
    </HeadlessButton>
  );
}
