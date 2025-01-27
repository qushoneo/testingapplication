import Input from "@/components/Input";
import Modal from "@/components/Modal";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelectedProjectStore } from "../../store/useSelectedProjectStore";
import folderRequests from "@/app/requests/folders";
import { Folder } from "@prisma/client";
import { Select } from "@/components/Select";
import { useModalStore } from "../../store/useModalStore";

export default function DeleteFolderDialog() {
  const { projectFolders, setProjectFolders, selectedProject } =
    useSelectedProjectStore();
  const { isDeleteFolderOpen, closeDeleteFolder, selectedFolderId } =
    useModalStore();

  const deletingFolder = projectFolders.find(
    (folder) => folder.id === selectedFolderId
  );

  const onSubmit = () => {
    if (selectedProject && selectedFolderId) {
      folderRequests
        .deleteFolder(selectedProject.id, selectedFolderId)
        .then((response) => {
          setProjectFolders(response.data);
        });
    }
  };

  if (!isDeleteFolderOpen) return null;

  return (
    <Modal
      isOpen={isDeleteFolderOpen}
      setIsOpen={closeDeleteFolder}
      cancelText="Delete folder"
      submitText="Cancel"
      panelClassname="w-[400px] h-[250px]"
      title="Delete folder"
      onSubmit={closeDeleteFolder}
      onCancel={() => {
        onSubmit();
      }}
      type="delete"
    >
      <div className="mt-[24px] flex whitespace-nowrap flex-wrap justify-center">
        <p>Are you sure you want delete</p>
        <p className="font-medium mx-[4px]">{deletingFolder?.name}</p>
        <p className="text-[16px]"> folder?</p>
      </div>
    </Modal>
  );
}
