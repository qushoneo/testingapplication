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

export default function EditFolderModal() {
  const { selectedProject, updateFolder } = useSelectedProjectStore();

  const projectFolders = useSelectedProjectStore(
    (state) => state.projectFolders
  );

  const { isEditFolderOpen, closeEditFolder, selectedFolderId } =
    useModalStore();

  const editingFolder = projectFolders.find(
    (folder) => folder.id === selectedFolderId
  );

  const [folderName, setFolderName] = useState<string>("");
  const [errors, setErrors] = useState<{ field: string; message: string }[]>(
    []
  );
  const [parentFolder, setParentFolder] = useState<SelectedFolder | null>(null);

  useEffect(() => {
    {
      if (selectedFolderId) {
        setFolderName(editingFolder?.name || "");
        setParentFolder(
          projectFolders.find(
            (folder) => folder.id === editingFolder?.parentId
          ) || null
        );
      }
    }
  }, [selectedFolderId]);

  const getAllChildFolders = (
    parentId: number,
    folders: Folder[]
  ): Folder[] => {
    const children = folders.filter((folder) => folder.parentId === parentId);

    return children.concat(
      children.flatMap((child) => getAllChildFolders(child.id, folders))
    );
  };

  const filteredFolders = projectFolders.filter((folder: Folder) => {
    if (!editingFolder) {
      return false;
    }

    const childFolders = getAllChildFolders(editingFolder.id, projectFolders);
    const childFolderIds = childFolders.map((folder) => folder.id);

    return (
      !childFolderIds.includes(folder.id) && folder.id !== editingFolder?.id
    );
  });

  const resetDialogData = () => {
    setFolderName("");
    setErrors([]);
    setParentFolder(null);
    closeEditFolder();
  };

  const onSubmit = () => {
    setErrors([]);

    if (!selectedProject || !editingFolder) {
      return;
    }

    if (folderName.length < 3) {
      setErrors([
        { field: "folder_name", message: "at least 4 symbols required" },
      ]);
    } else {
      folderRequests
        .updateFolder(
          selectedProject?.id,
          folderName,
          parentFolder?.id || null,
          editingFolder.id
        )
        .then((response) => {
          updateFolder(response.data);
          resetDialogData();
        });
    }
  };

  if (!isEditFolderOpen) return null;

  return (
    <Modal
      isOpen={isEditFolderOpen}
      setIsOpen={closeEditFolder}
      cancelText="Cancel"
      submitText="Update folder"
      panelClassname="w-[400px] h-[390px]"
      title="Update folder"
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
          options={[{ id: null, name: "Projects" }, ...filteredFolders]}
          setValue={setParentFolder}
          label="Parent suit"
        />
      </div>
    </Modal>
  );
}
