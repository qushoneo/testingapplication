"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { Button as HeadlessButton } from "@headlessui/react";

type ButtonProps = {
  label: ReactNode;
  variant?: "filled" | "outlined";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  label,
  disabled,
  className,
  variant = "filled",
  ...props
}: ButtonProps) {
  const variantStyle = {
    filled: "bg-black",
    outlined: "bg-transparent border-black",
  };

  const textVariantStyle = {
    filled: "text-white",
    outlined: "text-black",
  };

  return (
    <HeadlessButton
      {...props}
      className={`w-[100%] h-[40px] border rounded-[4px] px-[12px] py-[8px] ${
        disabled ? "bg-disabled border-gray" : "bg-black"
      } transition-all duration-200 ease-in-out active:scale-[0.95] ${
        variantStyle[variant]
      } ${className}`}
    >
      {typeof label === "string" ? (
        <p className={`font-normal ${textVariantStyle[variant]}`}>{label}</p>
      ) : (
        label
      )}
    </HeadlessButton>
  );
}
