"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { Button as HeadlessButton } from "@headlessui/react";

type ButtonProps = {
  label: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  label,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <HeadlessButton
      {...props}
      className={`w-[100%] h-[40px] border border-gray rounded-[4px] px-[12px] py-[8px] ${
        disabled ? "bg-disabled" : "bg-black"
      } transition-all duration-200 ease-in-out active:scale-[0.98] ${className}`}
    >
      {typeof label === "string" ? (
        <p className="text-white font-normal">{label}</p>
      ) : (
        label
      )}
    </HeadlessButton>
  );
}
