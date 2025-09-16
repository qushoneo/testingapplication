'use client';

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import React from 'react';
import Button from './Button';
import BlackCross from '@/app/../../public/assets/black_cross.svg';
import Image from 'next/image';

interface DialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit?: () => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  title?: string;
  panelClassname?: string;
  children?: React.ReactNode;
  type?: string;
  hideTitle?: boolean;
}

export default function Modal({
  isOpen,
  setIsOpen,
  onSubmit = () => {},
  onCancel = () => {},
  submitText,
  cancelText,
  panelClassname,
  children,
  title = 'Dialog Title',
  type,
  hideTitle = false,
}: DialogProps) {
  const closeModal = () => {
    setIsOpen(false);

    if (type !== 'delete') {
      onCancel();
    }
  };

  return (
    <>
      <Dialog
        tabIndex={-1}
        open={isOpen}
        onClose={closeModal}
        className='relative z-50'
      >
        <DialogBackdrop className='fixed inset-0 bg-black/30' />

        <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
          <DialogPanel
            className={`${panelClassname} rounded-[4px] bg-white p-[40px] pt-[20px] flex flex-col`}
          >
            {!hideTitle && (
              <DialogTitle
                className={`font-medium flex ${
                  type === 'delete' ? 'justify-center' : 'justify-between'
                }`}
              >
                <p className={`text-2xl`}>{title}</p>
                {type !== 'delete' && (
                  <Image
                    alt='close'
                    src={BlackCross}
                    className='cursor-pointer'
                    onClick={closeModal}
                  />
                )}
              </DialogTitle>
            )}

            {children}

            <div className='flex justify-end gap-[24px] mt-auto'>
              {cancelText && (
                <Button
                  label={cancelText}
                  className='w-[85px] min-w-fit'
                  onClick={() => {
                    onCancel();
                    closeModal();
                  }}
                  variant='outlined'
                />
              )}
              {submitText && (
                <Button
                  label={submitText}
                  onClick={() => {
                    onSubmit();
                  }}
                  className='w-[140px] min-w-fit'
                />
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
