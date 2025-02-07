import Input from "@/components/Input";
import Modal from "@/components/Modal";
import { useState } from "react";
import { useSelectedProjectStore } from "../../store/useSelectedProjectStore";
import { Select } from "@/components/Select";
import { useModalStore } from "../../store/useModalStore";
import { severities } from "@/app/lib/severities";
import { SeverityColor } from "@/components/SeverityColor";
import testCasesRequest from "@/app/requests/testCases";
import TextArea from "@/components/TextArea";

type SelectedSeverity = {
  id: string | null;
  name: string;
};

export default function CreateTestCaseDialog() {
  const { selectedProject, addProjectFolder, addTestCase } =
    useSelectedProjectStore();
  const [testCaseName, setTestCaseName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errors, setErrors] = useState<{ field: string; message: string }[]>(
    []
  );
  const [selectedSeverity, setSelectedSeverity] =
    useState<SelectedSeverity | null>(severities[0] || null);

  const { isCreateTestCaseOpen, closeCreateTestCase, selectedFolderId } =
    useModalStore();

  const severityIcons = [
    { id: null, icon: <SeverityColor value={null} /> },
    { id: "low", icon: <SeverityColor value="LOW" /> },
    { id: "medium", icon: <SeverityColor value="MEDIUM" /> },
    { id: "high", icon: <SeverityColor value="HIGH" /> },
  ];

  if (!isCreateTestCaseOpen) return null;

  const resetDialogData = () => {
    setTestCaseName("");
    setDescription("");
    setErrors([]);
    closeCreateTestCase();
  };

  const onSubmit = () => {
    setErrors([]);

    if (!selectedProject || !selectedFolderId) {
      return;
    }

    if (testCaseName.length < 3) {
      setErrors([
        { field: "testcase_name", message: "at least 4 symbols required" },
      ]);
    } else {
      testCasesRequest
        .createTestCase(
          selectedFolderId,
          selectedProject.id,
          testCaseName,
          description,
          selectedSeverity?.id || null
        )
        .then((response) => {
          addTestCase(response.data);
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
      panelClassname="w-[400px] h-[429px]"
      title="Create test case"
      onSubmit={onSubmit}
      onCancel={() => {
        resetDialogData();
        setErrors([]);
      }}
    >
      <div className="mt-[24px]">
        <Input
          value={testCaseName}
          onChange={(e) => setTestCaseName(e.target.value)}
          minLength={3}
          label="Test case name"
          hasError={!!errors.find((error) => error.field === "testcase_name")}
          errorMessage={
            errors.find((error) => error.field === "testcase_name")?.message
          }
        />
      </div>

      <div className="mt-[10px]">
        <Select
          value={selectedSeverity}
          options={severities}
          setValue={setSelectedSeverity}
          label="Severity"
          showIconsByValue={true}
          icons={severityIcons}
        />
      </div>

      <div className="mt-[10px]">
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label="Description"
        />
      </div>
    </Modal>
  );
}
