import { Folder } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import Minus from "@/app/assets/black_minus.svg";
import Plus from "@/app/assets/black_plus.svg";
import { useSelectedProjectStore } from "@/app/projects/[projectId]/store/useSelectedProjectStore";
import CaseTest from "./TestCase";

interface FolderProps {
  folder: Folder;
}

export default function TreeFolder({ folder }: FolderProps) {
  const { projectFolders, testCases } = useSelectedProjectStore();

  const [open, setOpen] = useState<boolean>(false);

  const childrenFolders = projectFolders.filter(
    (childrenFolder) => childrenFolder.parentId === folder.id
  );

  const childrenTestCases = testCases.filter(
    (childrenTestCase) => childrenTestCase.folderId === folder.id
  );

  return (
    <div className={`w-full ${folder.parentId ? "border-l" : ""} border-gray`}>
      <div
        className="flex items-center gap-[4px] cursor-pointer pl-[10px] py-[2px] h-[22px]"
        onClick={() => setOpen(!open)}
      >
        <div className="border border-gray rounded-[4px] w-[16px] h-[16px]">
          <Image src={open ? Minus : Plus} alt="minus" />
        </div>
        <p className="text-left text-[14px]">{folder.name}</p>
        {childrenFolders.length > 0 && (
          <p className="border border-gray rounded-[4px] min-w-[16px] h-[16px] text-[12px] flex items-center justify-center ml-auto">
            {childrenFolders.length}
          </p>
        )}
      </div>
      {open && (
        <>
          <div className="ml-[18px] flex flex-col">
            {childrenFolders.map((childrenFolder) => (
              <TreeFolder key={childrenFolder.id} folder={childrenFolder} />
            ))}
          </div>
          <div className="ml-[18px] flex flex-col border-l border-gray">
            {childrenTestCases.map((childrenTestCase) => (
              <CaseTest key={childrenTestCase.id} testCase={childrenTestCase} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
