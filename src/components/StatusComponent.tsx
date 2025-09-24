"use client";

import { Status } from "@/types/Status";
import Icon, { IconType } from "./Icon";

type StatusComponentProps = {
  status: Status;
  className?: string;
  size?: "s" | "m";
};

const statusConfig = {
  inProgress: {
    icon: "loading" as IconType,
    label: "In progress",
    styles: "bg-inProgress ",
    textColor: "text-textPrimary",
  },
  failed: {
    icon: "small_black_cross" as IconType,
    label: "Failed",
    styles: "bg-failed ",
    textColor: "text-textPrimary",
  },
  passed: {
    icon: "black_check" as IconType,
    label: "Passed",
    styles: "bg-passed ",
    textColor: "text-textPrimary",
  },
  skipped: {
    icon: "skip" as IconType,
    label: "Skipped",
    styles: "bg-skipped",
    textColor: "text-textPrimary",
  },
  untested: {
    icon: null,
    label: "Untested",
    styles: "bg-textPrimary",
    textColor: "text-white",
  },
  new: {
    icon: "warning",
    label: "New",
    styles: "bg-new",
    textColor: "text-textPrimary",
  },
  inQA: {
    icon: "tool",
    label: "In QA",
    styles: "bg-inQA",
    textColor: "text-textPrimary",
  },
  resolved: {
    icon: "check_circle",
    label: "Resolved",
    styles: "bg-passed",
    textColor: "text-textPrimary",
  },
} as const;

const sizeConfig = {
  s: {
    container: "py-[4px] px-[8px]",
    content: "gap-[4px]",
    text: "text-[12px]",
    icon: 14,
  },
  m: {
    container: "py-[8px] px-[8px]",
    content: "gap-[6px]",
    text: "text-[14px]",
    icon: 16,
  },
} as const;

export default function StatusComponent({
  status = "inProgress",
  className = "",
  size = "s",
  ...props
}: StatusComponentProps) {
  const config = statusConfig[status];
  const sizeCfg = sizeConfig[size];

  return (
    <div
      {...props}
      className={`flex items-center rounded-[4px] w-fit max-w-fit ${sizeCfg.container} ${config.styles} ${className}`}
    >
      <div className={`flex items-center ${sizeCfg.content}`}>
        {config.icon && <Icon name={config.icon} size={sizeCfg.icon} />}
        <p className={`text-[12px] ${config.textColor} ${sizeCfg.text}`}>
          {config.label}
        </p>
      </div>
    </div>
  );
}
