"use client";

import Image from "next/image";
import { useSelectedProjectStore } from "../store/useSelectedProjectStore";
import BlackPlus from "@/app/assets/black_plus.svg";
import Pencil from "@/app/assets/pencil.svg";
import Trash from "@/app/assets/trash.svg";
import { useModalStore } from "../store/useModalStore";
import { Folder } from "@prisma/client";
import axios from "axios";

type ProjectFolderProps = {
  folder: Folder;
  depth?: number;
};

export default function ProjectFolder({ folder }: ProjectFolderProps) {
  const { projectFolders, setProjectFolders, selectedProject } =
    useSelectedProjectStore();
  const { openCreateFolder, openEditFolder } = useModalStore();

  const childrens = projectFolders.filter(
    (projectFolder) => projectFolder.parentId === folder.id
  );

  const deleteFolder = (folderId: number) => {
    if (!selectedProject) {
      return;
    }

    axios
      .delete(`/api/projects/${selectedProject.id}/folders/`, {
        data: {
          folderId: folderId,
        },
      })
      .then((response) => {
        setProjectFolders(response.data);
      });
  };

  return (
    <div className="flex flex-col">
      <div className="flex-1 py-[8px] pl-[24px] pr-[40px] bg-lightgray rounded-[4px] mb-[12px] flex items-center">
        <p className="text-[18px] font-medium">{folder.name}</p>

        <div className="flex gap-[12px] ml-[12px]">
          <Image
            className="rounded-[4px] border border-[gray] w-[16px] h-[16px] cursor-pointer"
            alt="add"
            src={BlackPlus}
            onClick={() => openCreateFolder(folder.id)}
          />

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
            onClick={() => deleteFolder(folder.id)}
          />
        </div>
      </div>

      <div className="pl-[36px] flex flex-col">
        {childrens.map((childFolder) => (
          <ProjectFolder key={childFolder.id} folder={childFolder} />
        ))}
      </div>
    </div>
  );
}
