"use client";

import Image from "next/image";
import { useSelectedProjectStore } from "../store/useSelectedProjectStore";
import BlackPlus from "@/app/assets/black_plus.svg";
import Pencil from "@/app/assets/pencil.svg";
import Trash from "@/app/assets/trash.svg";
import { useModalStore } from "../store/useModalStore";
import { Folder } from "@prisma/client";
import ProjectTestCase from "./TestCase";
import Dropdown from "@/components/Dropdown";

type ProjectFolderProps = {
  folder: Folder;
  depth?: number;
};

export default function ProjectFolder({ folder }: ProjectFolderProps) {
  const { projectFolders, testCases } = useSelectedProjectStore();
  const {
    openCreateFolder,
    openEditFolder,
    openDeleteFolder,
    openCreateTestCase,
  } = useModalStore();

  const childrenFolders = projectFolders.filter(
    (projectFolder) => projectFolder.parentId === folder.id
  );

  const childrenTestCases = testCases.filter(
    (testCase) => testCase.folderId === folder.id
  );

  return (
    <div className="flex flex-col">
      <div className="flex-1 py-[8px] pl-[24px] pr-[40px] bg-lightgray rounded-[4px] mb-[12px] flex items-center">
        <p className="text-[18px] font-medium">{folder.name}</p>

        <div className="flex gap-[12px] ml-[12px]">
          <Dropdown
            options={[
              {
                label: "Create folder",
                onClick: () => openCreateFolder(folder.parentId || null),
              },

              {
                label: "Create test case",
                onClick: () => openCreateTestCase(folder.id || null),
              },
            ]}
          >
            <Image
              className="rounded-[4px] border border-[gray] w-[16px] h-[16px] cursor-pointer"
              alt="add"
              src={BlackPlus}
            />
          </Dropdown>

          <Image
            className="rounded-[4px] border border-[gray] w-[16px] h-[16px] cursor-pointer"
            alt="edit"
            src={Pencil}
            onClick={() => openEditFolder(folder.id)}
          />

          <Image
            className="rounded-[4px] border border-[gray] w-[16px] h-[16px] cursor-pointer"
            alt="delete"
            src={Trash}
            onClick={() => openDeleteFolder(folder.id)}
          />
        </div>
      </div>

      <div className="pl-[36px] flex flex-col">
        {childrenTestCases.length > 0 && (
          <div className="pl-[36px] flex flex-col gap-[4px] mb-[12px]">
            {childrenTestCases.map((testCase) => (
              <ProjectTestCase key={testCase.id} testCase={testCase} />
            ))}
          </div>
        )}

        {childrenFolders.map((childFolder) => (
          <ProjectFolder key={childFolder.id} folder={childFolder} />
        ))}
      </div>
    </div>
  );
}
