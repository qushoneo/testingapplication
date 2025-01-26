"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import React, { Children, useState } from "react";
import Button from "./Button";
import BlackCross from "@/app/assets/black_cross.svg";
import Image from "next/image";

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
  title = "Dialog Title",
}: DialogProps) {
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel
            className={`${panelClassname} rounded-[4px] bg-white p-[40px] pt-[20px] flex flex-col`}
          >
            <DialogTitle className="font-medium flex justify-between">
              <p className="text-2xl">{title}</p>{" "}
              <Image
                alt="close"
                src={BlackCross}
                className="cursor-pointer"
                onClick={closeModal}
              />
            </DialogTitle>

            {children}

            <div className="flex justify-end gap-[24px] mt-auto">
              <Button
                label={cancelText}
                className="w-[85px]"
                onClick={() => {
                  onCancel();
                  closeModal();
                }}
                variant="outlined"
              />
              <Button
                label={submitText}
                onClick={() => {
                  onSubmit();
                  //   closeModal();
                }}
                className="w-[140px]"
              />
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
