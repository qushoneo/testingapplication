import Image from "next/image";
import Arrow from "@/app/assets/arrow_down.svg";
import { useSelectedProjectStore } from "../store/useSelectedProjectStore";

type LeftSideProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LeftSide({ isOpen, setIsOpen }: LeftSideProps) {
  const onArrowClick = () => {
    setIsOpen(!isOpen);
  };

  const { selectedProject, projectFolders } = useSelectedProjectStore();

  const leftSideStyle = {
    open: "min-w-[270px]",
    closed: "min-w-[20px]",
  };

  return (
    selectedProject && (
      <div
        className={`h-full border-r border-gray relative duration-[200ms] z-[3] ${
          leftSideStyle[isOpen ? "open" : "closed"]
        }`}
      >
        {isOpen && (
          <div
            className={`p-[30px] flex items-center gap-[4px] absolute w-full`}
          >
            <p
              className={`text-lg max-w-[100px] ${
                isOpen ? "overflow-hidden" : ""
              } whitespace-nowrap ellipsis text-ellipsi font-medium`}
            >
              {selectedProject?.name}
            </p>
            <p className="text-lg font-medium"> storage</p>
            <div
              className={`p-[2px] rounded-[4px] border border-gray min-w-[24px] flex items-center justify-center ml-auto`}
            >
              <p className="text-[12px] ">{projectFolders?.length}</p>
            </div>
          </div>
        )}
        <div
          onClick={onArrowClick}
          className="absolute right-[-7.5px] cursor-pointer top-[35px]"
        >
          <Image
            src={Arrow}
            alt="arrow"
            className={` w-[14px] h-[14px]  bg-white rounded-[50%] transition duration-[300ms] ${
              isOpen ? "rotate-[90deg]" : "rotate-[270deg]"
            } border border-gray`}
          />
        </div>
      </div>
    )
  );
}
