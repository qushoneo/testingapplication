import Image from 'next/image';
import TrashIcon from '@/app/../../public/assets/trash.svg';
import PencilIcon from '@/app/../../public/assets/pencil.svg';
import CrossIcon from '@/app/../../public/assets/black_cross.svg';
import DuplicateIcon from '@/app/../../public/assets/duplicate.svg';
import WhitePlus from '@/app/../../public/assets/white_plus.svg';
import BlackPlus from '@/app/../../public/assets/black_plus.svg';
import PlayIcon from '@/app/../../public/assets/play.svg';

export type IconType =
  | 'trash'
  | 'pencil'
  | 'cross'
  | 'duplicate'
  | 'white_plus'
  | 'black_plus'
  | 'play';

interface IconProps {
  name: IconType;
  size?: number;
}

const icons = {
  trash: TrashIcon,
  pencil: PencilIcon,
  cross: CrossIcon,
  duplicate: DuplicateIcon,
  white_plus: WhitePlus,
  black_plus: BlackPlus,
  play: PlayIcon,
};

export default function Icon({ name, size = 20 }: IconProps) {
  return (
    name && (
      <Image src={icons[name]} alt={`${name}`} width={size} height={size} />
    )
  );
}
