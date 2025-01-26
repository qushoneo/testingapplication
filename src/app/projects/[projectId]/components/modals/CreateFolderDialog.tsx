import Input from "@/components/Input";
import Modal from "@/components/Modal";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelectedProjectStore } from "../../store/useSelectedProjectStore";
import folderRequests from "@/app/requests/folders";
import { Folder } from "@prisma/client";
import { Select } from "@/components/Select";

interface DialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type SelectedFolder = {
  id: number | null;
  name: string;
};

export default function CreateFolderDialog({ isOpen, setIsOpen }: DialogProps) {
  const { selectedProject, addProjectFolder, projectFolders } =
    useSelectedProjectStore();
  const [folderName, setFolderName] = useState<string>("");
  const [errors, setErrors] = useState<{ field: string; message: string }[]>(
    []
  );

  const [parentFolder, setParentFolder] = useState<SelectedFolder | null>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      createProject();
    }
  };

  const resetDialogData = () => {
    setFolderName("");
    setErrors([]);
    setParentFolder(null);
    setIsOpen(false);
  };

  const createProject = () => {
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

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      cancelText="Cancel"
      submitText="Create folder"
      panelClassname="w-[400px] h-[390px]"
      title="Create folder"
      onSubmit={createProject}
      onCancel={() => {
        setFolderName("");
        setErrors([]);
      }}
    >
      <div className="mt-[24px]">
        <Input
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          minLength={3}
          label="Folder name"
          onKeyDown={handleKeyDown}
          hasError={!!errors.find((error) => error.field === "folder_name")}
          errorMessage={
            errors.find((error) => error.field === "folder_name")?.message
          }
        />
      </div>

      <div className="mt-[24px]">
        <Select
          value={parentFolder}
          options={[{ id: null, name: "Projects" }, ...projectFolders]}
          setValue={setParentFolder}
          label="Parent suit"
        />
      </div>
    </Modal>
  );
}
