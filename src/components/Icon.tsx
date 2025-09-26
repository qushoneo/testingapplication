import Image from "next/image";
import TrashIcon from "@/app/../../public/assets/trash.svg";
import PencilIcon from "@/app/../../public/assets/pencil.svg";
import CrossIcon from "@/app/../../public/assets/black_cross.svg";
import DuplicateIcon from "@/app/../../public/assets/duplicate.svg";
import WhitePlus from "@/app/../../public/assets/white_plus.svg";
import BlackPlus from "@/app/../../public/assets/black_plus.svg";
import BlackMinus from "@/app/../../public/assets/black_minus.svg";
import PlayIcon from "@/app/../../public/assets/play.svg";
import BlackCheck from "@/app/../../public/assets/black_check.svg";
import SmallBlackCross from "@/app/../../public/assets/small_black_cross.svg";
import Loading from "@/app/../../public/assets/loading.svg";
import Skip from "@/app/../../public/assets/skip.svg";
import Warning from "@/app/../../public/assets/warning.svg";
import Tool from "@/app/../../public/assets/tool.svg";
import CheckCircle from "@/app/../../public/assets/check_circle.svg";
import WhiteCheck from "@/app/../../public/assets/white_check.svg";
import ArrowLeft from "@/app/../../public/assets/arrow_left.svg";
import Repeat from "@/app/../../public/assets/repeat.svg";

export type IconType =
  | "trash"
  | "pencil"
  | "cross"
  | "duplicate"
  | "white_plus"
  | "black_plus"
  | "black_minus"
  | "play"
  | "black_check"
  | "small_black_cross"
  | "loading"
  | "skip"
  | "warning"
  | "tool"
  | "check_circle"
  | "white_check"
  | "arrow_left"
  | "repeat";

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
  skip: Skip,
  warning: Warning,
  tool: Tool,
  check_circle: CheckCircle,
  white_check: WhiteCheck,
  arrow_left: ArrowLeft,
  black_minus: BlackMinus,
  repeat: Repeat,
};

export default function Icon({ name, size = 20 }: IconProps) {
  return (
    name && (
      <Image src={icons[name]} alt={`${name}`} width={size} height={size} />
    )
  );
}
