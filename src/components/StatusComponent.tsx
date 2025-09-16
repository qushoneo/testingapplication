'use client';

import Icon, { IconType } from './Icon';

type StatusComponentProps = {
  status: 'inProgress' | 'failed' | 'passed';
  className?: string;
};

const statusConfig = {
  inProgress: {
    icon: 'loading' as IconType,
    label: 'In progress',
    styles: 'bg-inProgress ',
  },
  failed: {
    icon: 'small_black_cross' as IconType,
    label: 'Failed',
    styles: 'bg-failed ',
  },
  passed: {
    icon: 'black_check' as IconType,
    label: 'Passed',
    styles: 'bg-passed ',
  },
} as const;

export default function StatusComponent({
  status = 'inProgress',
  className = '',
  ...props
}: StatusComponentProps) {
  const config = statusConfig[status];

  return (
    <div
      {...props}
      className={`flex items-center py-[4px] px-[8px] rounded-[4px] w-fit max-w-fit ${config.styles} ${className}`}
    >
      <div className='flex items-center gap-[4px]'>
        <Icon name={config.icon} size={14} />
        <p className='text-[12px] text-textPrimary'>{config.label}</p>
      </div>
    </div>
  );
}
