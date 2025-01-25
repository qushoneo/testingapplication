"use client";

import Image from "next/image";
import { InputHTMLAttributes, useState } from "react";
import OpenEye from "@/app/assets/open_eye.svg";
import ClosedEye from "@/app/assets/closed_eye.svg";
import Check from "@/app/assets/green_check.svg";
import Cross from "@/app/assets/red_cross.svg";
import ErrorSign from "@/app/assets/red_error_sign.svg";

type InputProps = {
  label: string;
  showPasswordRequirements?: boolean;
  hasError?: boolean;
  errorMessage?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  label,
  showPasswordRequirements,
  type,
  value = "",
  hasError,
  errorMessage,
  ...props
}: InputProps) {
  const [showValue, setShowValue] = useState(true);

  const switchShowValue = () => {
    setShowValue(!showValue);
  };

  const passwordRequirements = [
    "minimum 8 characters",
    "at least 1 number",
    "at least 1 special symbol",
  ];

  const validatePassword: { [key: number]: () => boolean } = {
    0: (): boolean => (value as string).length >= 8,
    1: (): boolean => /[0-9]/.test(value as string),
    2: (): boolean => /[!@#$%^&*(),.?":{}|<>]/.test(value as string),
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-textPrimary mb-[4px] text-xs">{label}</p>

        {type === "password" &&
          (showValue ? (
            <Image
              onClick={switchShowValue}
              src={ClosedEye}
              alt="password-hidden"
              className="cursor-pointer w-[16px]"
            />
          ) : (
            <Image
              onClick={switchShowValue}
              src={OpenEye}
              alt="password-show"
              className="cursor-pointer w-[16px]"
            />
          ))}
      </div>

      <input
        {...props}
        type={type === "password" && showValue ? "password" : type}
        className={`w-[100%] h-[34px] border rounded-[4px] px-[12px] py-[8px] text-sm ${
          hasError ? "border-red" : "border-gray"
        }`}
      />

      {hasError && errorMessage && (
        <div className="flex items-center mt-[3px] gap-[3px]">
          <Image src={ErrorSign} className="w-[14px] h-[14px]" alt="error" />
          <p className="text-red text-xs ">{errorMessage}</p>
        </div>
      )}

      {showPasswordRequirements &&
        (value.toString().length > 0 || hasError) && (
          <div className="mt-[3px]">
            {passwordRequirements.map((option, index) => {
              const isValid = validatePassword[index]();
              return (
                <div className="flex items-center gap-[3px]" key={option}>
                  <Image
                    alt={isValid ? "valid" : "invalid"}
                    src={isValid ? Check : Cross}
                    className="w-[16px] h-[16px]"
                  />
                  <p
                    className={
                      isValid ? "text-green text-xs" : "text-red text-xs"
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
