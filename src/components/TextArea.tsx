'use client';

import { TextareaHTMLAttributes } from 'react';

type TextAreaProps = {
  label: string;
  maxLength?: number;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function TextArea({
  label,
  value = '',
  onChange,
  className,
  maxLength = 255,
  ...props
}: TextAreaProps) {
  return (
    <div>
      <div>
        <p className='text-textPrimary mb-[3px] text-xs'>{label}</p>
        <textarea
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          className={`w-[100%] h-[72px] border border-gray rounded-[4px] px-[8px] py-[4px] text-sm resize-none font-inter  ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}
