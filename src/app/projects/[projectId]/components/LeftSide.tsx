import Image from "next/image";
import Arrow from "@/app/../../public/assets/arrow_down.svg";
import FolderTree from "@/components/folder_tree/FolderTree";
import { useProjectStorageStore } from "@/stores/useProjectStorageStore";
import { useFetch } from "@/app/hooks/useFetch";

type LeftSideProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LeftSide({ isOpen, setIsOpen }: LeftSideProps) {
  const onArrowClick = () => {
    setIsOpen(!isOpen);
  };

  const { selectedProject } = useProjectStorageStore();

  const { data: folders, isLoading: isFolderLoading } = useFetch(
    `projects/${selectedProject?.id}/folders`
  );

  const { data: testCases, isLoading: isTestCaseLoading } = useFetch(
    `projects/${selectedProject?.id}/test_cases`
  );

  const leftSideStyle = {
    open: "min-w-[270px]",
    closed: "min-w-[20px]",
  };

  return (
    selectedProject &&
    !isFolderLoading &&
    !isTestCaseLoading && (
      <div
        className={`h-full border-r border-gray relative duration-[200ms] z-[11] ${
          leftSideStyle[isOpen ? "open" : "closed"]
        }`}
      >
        {isOpen && (
          <div
            className={`p-[30px] flex items-center gap-[20px] absolute w-full flex-col `}
          >
            <div className="flex gap-[4px] items-center ">
              <div className="flex gap-[4px] min-w-[190px]">
                <p
                  className={`text-lg max-w-[100px] ${
                    isOpen ? "overflow-hidden" : ""
                  } whitespace-nowrap text-ellipsis font-medium`}
                >
                  {selectedProject?.name}
                </p>
                <p className="text-lg font-medium"> storage</p>
              </div>
              <div
                className={`p-[2px] rounded-[4px] border border-gray min-w-[16px] h-[16px] flex items-center justify-center`}
              >
                <p className="text-[12px] ">{folders?.length}</p>
              </div>
            </div>
            <FolderTree folders={folders} testCases={testCases} />
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
