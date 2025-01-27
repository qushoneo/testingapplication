"use client";

type SeverityProps = {
  value: "low" | "high" | "medium" | null;
};

export const SeverityColor = ({ value }: SeverityProps) => {
  const severityColor = {
    high: "bg-red",
    medium: "bg-yellow",
    low: "bg-green",
  };

  const circleClass =
    value === null
      ? "bg-white border border-textPrimary"
      : severityColor[value];

  return (
    <div className={`w-[10px] h-[10px] rounded-full ${circleClass}`}></div>
  );
};
