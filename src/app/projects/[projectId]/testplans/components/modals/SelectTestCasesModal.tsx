import Modal from "@/components/Modal";
import { useModalStore } from "@/stores/useModalStore";
import Arrow from "../../../../../../../public/assets/arrow_down.svg";
import Image from "next/image";
import Cross from "../../../../../../../public/assets/black_cross.svg";
import Input from "@/components/Input";
import Search from "../../../../../../../public/assets/search.svg";
import { useState } from "react";
import FolderTree from "@/components/folder_tree/FolderTree";
import ProjectFolder from "../../../components/ProjectFolder";
import Loading from "@/components/Loading";
import { useFetch } from "@/app/hooks/useFetch";
import useSelectedTestCasesStore from "@/stores/useTestCasesStore";
import { Folder } from "@/types/Folder";

export default function SelectTestCasesModal({
  projectId,
}: {
  projectId: string;
}) {
  const { closeSelectTestCases } = useModalStore();
  const [search, setSearch] = useState("");
  const { setSelectedTestCases } = useSelectedTestCasesStore();

  const { data: folders, isLoading: isFolderLoading } = useFetch(
    `projects/${projectId}/folders`
  );

  const { data: testCases, isLoading: isTestCaseLoading } = useFetch(
    `projects/${projectId}/test_cases`
  );

  return (
    <Modal
      isOpen={true}
      setIsOpen={closeSelectTestCases}
      hideTitle
      panelClassname="w-full mx-[45px] h-[calc(100%-60px)] flex flex-col gap-[12px]"
      cancelText="Cancel"
      submitText="Done"
      onSubmit={() => {
        closeSelectTestCases();
      }}
      onCancel={() => {
        closeSelectTestCases();
        setSearch("");
        setSelectedTestCases([]);
      }}
    >
      <div className="w-[full] h-[30px] flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          <Image
            src={Arrow}
            alt="close"
            width={24}
            height={24}
            onClick={closeSelectTestCases}
            className="transform rotate-90"
          />
          <p className="font-medium text-[24px]">Select test cases</p>
        </div>

        <Image
          src={Cross}
          alt="close"
          width={24}
          height={24}
          onClick={closeSelectTestCases}
        />
      </div>

      <div>
        <Input
          placeholder="Search"
          placeholderIcon={Search}
          className="w-[273px]"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          fieldName="search"
        />
      </div>

      {isFolderLoading || isTestCaseLoading ? (
        <Loading />
      ) : (
        <div className="w-full h-full flex border border-gray rounded-[8px] overflow-hidden">
          <div className="min-w-[273px] max-w-[273px] h-full border-r border-gray px-[30px] py-[20px]">
            <FolderTree folders={folders} testCases={testCases} />
          </div>

          <div className="w-full h-full overflow-auto px-[30px] py-[20px]">
            {folders
              .filter((folder: Folder) => folder.parentId === null)
              .map((folder: Folder) => (
                <ProjectFolder
                  key={folder.id}
                  folder={folder}
                  mode="select"
                  search={search}
                />
              ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
