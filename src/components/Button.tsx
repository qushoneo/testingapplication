"use client";

import { ButtonHTMLAttributes } from "react";

type ButtonProps = {
  label: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ label, disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`w-[100%] h-[34px] border border-gray rounded-[4px] px-[12px] py-[8px] ${
        disabled ? "bg-disabled" : "bg-black"
      } h-[40px]`}
    >
      <p className="text-white ">{label}</p>
    </button>
  );
}
