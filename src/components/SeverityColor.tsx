'use client';

type SeverityProps = {
  value: 'LOW' | 'HIGH' | 'MEDIUM' | null;
};

export const SeverityColor = ({ value }: SeverityProps) => {
  const severityColor = {
    HIGH: 'bg-red',
    MEDIUM: 'bg-yellow',
    LOW: 'bg-green',
  };

  const circleClass =
    value === null
      ? 'bg-white border border-textPrimary'
      : severityColor[value];

  return (
    <div
      className={`min-w-[10px] min-h-[10px] rounded-full ${circleClass}`}
    ></div>
  );
};
