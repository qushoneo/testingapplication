import Image from 'next/image';
import CheckboxActive from '@/app/assets/checkbox_checked.svg';
import CheckboxInactive from '@/app/assets/checkbox_empty.svg';

type CheckboxProps = {
  isActive: boolean;
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
  className?: string;
};

export default function Checkbox({
  isActive,
  onClick,
  className,
}: CheckboxProps) {
  return (
    <Image
      onClick={onClick}
      src={isActive ? CheckboxActive : CheckboxInactive}
      alt={isActive ? 'active' : 'inactive'}
      className={`${className} cursor-pointer`}
    />
  );
}
