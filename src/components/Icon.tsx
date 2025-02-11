import Image from 'next/image';
import TrashIcon from '@/app/assets/trash.svg';
import PencilIcon from '@/app/assets/pencil.svg';
import CrossIcon from '@/app/assets/black_cross.svg';
import DuplicateIcon from '@/app/assets/duplicate.svg';

export type IconType = 'trash' | 'pencil' | 'cross' | 'duplicate';

interface IconProps {
  name: IconType;
  size?: number;
}

const icons = {
  trash: TrashIcon,
  pencil: PencilIcon,
  cross: CrossIcon,
  duplicate: DuplicateIcon,
};

export default function Icon({ name, size = 20 }: IconProps) {
  return (
    name && (
      <Image src={icons[name]} alt={`${name}`} width={size} height={size} />
    )
  );
}
