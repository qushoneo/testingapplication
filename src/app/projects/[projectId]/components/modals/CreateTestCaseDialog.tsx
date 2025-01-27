import Input from "@/components/Input";
import Modal from "@/components/Modal";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelectedProjectStore } from "../../store/useSelectedProjectStore";
import folderRequests from "@/app/requests/folders";
import { Folder, Severity } from "@prisma/client";
import { Select } from "@/components/Select";
import { useModalStore } from "../../store/useModalStore";
import { severities } from "@/app/lib/severities";
import { SeverityColor } from "@/components/SeverityColor";

type SelectedFolder = {
  id: number | null;
  name: string;
};

type SelectedSeverity = {
  id: string | null;
  name: string;
};

export default function CreateTestCaseDialog() {
  const { selectedProject, addProjectFolder, projectFolders } =
    useSelectedProjectStore();
  const [folderName, setFolderName] = useState<string>("");
  const [errors, setErrors] = useState<{ field: string; message: string }[]>(
    []
  );
  const [selectedSeverity, setSelectedSeverity] =
    useState<SelectedSeverity | null>(severities[0] || null);
  const [parentFolder, setParentFolder] = useState<SelectedFolder | null>(null);

  const { isCreateTestCaseOpen, closeCreateTestCase } = useModalStore();

  const severityIcons = [
    { id: null, icon: <SeverityColor value={null} /> },
    { id: "low", icon: <SeverityColor value="low" /> },
    { id: "medium", icon: <SeverityColor value="medium" /> },
    { id: "high", icon: <SeverityColor value="high" /> },
  ];

  if (!isCreateTestCaseOpen) return null;

  const resetDialogData = () => {
    setFolderName("");
    setErrors([]);
    setParentFolder(null);
    closeCreateTestCase();
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

  return (
    <Modal
      isOpen={isCreateTestCaseOpen}
      setIsOpen={closeCreateTestCase}
      cancelText="Cancel"
      submitText="Create test case"
      panelClassname="w-[400px] h-[390px]"
      title="Create test case"
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
          label="Test case name"
          hasError={!!errors.find((error) => error.field === "testcase_name")}
          errorMessage={
            errors.find((error) => error.field === "testcase_name")?.message
          }
        />
      </div>

      <div className="mt-[24px]">
        <Select
          value={selectedSeverity}
          options={severities}
          setValue={setSelectedSeverity}
          label="Severity"
          showIconsByValue={true}
          icons={severityIcons}
        />
      </div>
    </Modal>
  );
}
