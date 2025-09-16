import Image from 'next/image';
import TrashIcon from '@/app/../../public/assets/trash.svg';
import PencilIcon from '@/app/../../public/assets/pencil.svg';
import CrossIcon from '@/app/../../public/assets/black_cross.svg';
import DuplicateIcon from '@/app/../../public/assets/duplicate.svg';
import WhitePlus from '@/app/../../public/assets/white_plus.svg';
import BlackPlus from '@/app/../../public/assets/black_plus.svg';
import PlayIcon from '@/app/../../public/assets/play.svg';
import BlackCheck from '@/app/../../public/assets/black_check.svg';
import SmallBlackCross from '@/app/../../public/assets/small_black_cross.svg';
import Loading from '@/app/../../public/assets/loading.svg';

export type IconType =
  | 'trash'
  | 'pencil'
  | 'cross'
  | 'duplicate'
  | 'white_plus'
  | 'black_plus'
  | 'play'
  | 'black_check'
  | 'small_black_cross'
  | 'loading';

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
  black_check: BlackCheck,
  small_black_cross: SmallBlackCross,
  loading: Loading,
};

export default function Icon({ name, size = 20 }: IconProps) {
  return (
    name && (
      <Image src={icons[name]} alt={`${name}`} width={size} height={size} />
    )
  );
}
