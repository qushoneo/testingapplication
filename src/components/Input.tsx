import { InputHTMLAttributes } from "react";

type InputProps = {
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function Input({ label, ...props }: InputProps) {
  return (
    <div>
      <p className="text-textPrimary mb-[4px] text-[12px]">{label}</p>

      <input
        {...props}
        className="w-[100%] h-[34px] border border-gray rounded-[4px] px-[12px] py-[8px]  text-[14px]"
      />
    </div>
  );
}
