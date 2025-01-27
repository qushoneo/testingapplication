import Input from "@/components/Input";
import Modal from "@/components/Modal";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelectedProjectStore } from "../../store/useSelectedProjectStore";
import folderRequests from "@/app/requests/folders";
import { Folder } from "@prisma/client";
import { Select } from "@/components/Select";
import { useModalStore } from "../../store/useModalStore";

type SelectedFolder = {
  id: number | null;
  name: string;
  parentId?: number | null;
};

export default function CreateFolderDialog() {
  const { selectedProject, addProjectFolder, projectFolders } =
    useSelectedProjectStore();
  const { isCreateFolderOpen, closeCreateFolder, selectedFolderId } =
    useModalStore();

  const [folderName, setFolderName] = useState<string>("");
  const [errors, setErrors] = useState<{ field: string; message: string }[]>(
    []
  );
  const [parentFolder, setParentFolder] = useState<SelectedFolder | null>(null);

  useEffect(() => {
    if (selectedFolderId && isCreateFolderOpen) {
      setParentFolder(
        projectFolders.find((folder) => selectedFolderId === folder.id) || null
      );
    }
  }, [isCreateFolderOpen]);

  const resetDialogData = () => {
    setFolderName("");
    setErrors([]);
    setParentFolder(null);
    closeCreateFolder();
  };

  const onSubmit = () => {
    setErrors([]);

    if (!selectedProject) {
      return;
    }

    if (folderName.length < 3) {
      setErrors([
        { field: "folder_name", message: "at least 4 symbols required" },
      ]);
    } else {
      folderRequests
        .createFolder(selectedProject?.id, folderName, parentFolder?.id || null)
        .then((response) => {
          addProjectFolder(response.data);
          resetDialogData();
        });
    }
  };

  if (!isCreateFolderOpen) return null;

  return (
    <Modal
      isOpen={isCreateFolderOpen}
      setIsOpen={closeCreateFolder}
      cancelText="Cancel"
      submitText="Create folder"
      panelClassname="w-[400px] h-[390px]"
      title="Create folder"
      onSubmit={onSubmit}
      onCancel={() => {
        resetDialogData();
        setErrors([]);
      }}
    >
      <div className="mt-[24px]">
        <Input
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          minLength={3}
          label="Folder name"
          hasError={!!errors.find((error) => error.field === "folder_name")}
          errorMessage={
            errors.find((error) => error.field === "folder_name")?.message
          }
        />
      </div>

      <div className="mt-[24px]">
        <Select
          value={parentFolder}
          options={[
            { id: null, name: `${selectedProject?.name} Project` || "" },
            ...projectFolders,
          ]}
          setValue={setParentFolder}
          label="Parent folder"
        />
      </div>
    </Modal>
  );
}
