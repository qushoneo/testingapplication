"use client";

import { Folder } from "@prisma/client";
import { useProjectsStore } from "../../useProjectsStore";
import { useSelectedProjectStore } from "../store/useSelectedProjectStore";

type ProjectFolderProps = {
  folder: any;
  depth?: number;
};

export default function ProjectFolder({ folder }: ProjectFolderProps) {
  const { projectFolders } = useSelectedProjectStore();

  console.log("render");

  const childrens = projectFolders.filter(
    (projectFolder) => projectFolder.parentId === folder.id
  );

  return (
    <div className="flex flex-col">
      <div className="flex-1 py-[8px] pl-[24px] pr-[40px] bg-lightgray rounded-[4px] mb-[12px]">
        <p className="text-[18px] font-medium">
          id= {folder.id} {folder.name} ({childrens.length} children)
        </p>
      </div>

      <div className="pl-[36px] flex flex-col">
        {childrens.map((childFolder) => (
          <ProjectFolder key={childFolder.id} folder={childFolder} />
        ))}
      </div>
    </div>
  );
}
