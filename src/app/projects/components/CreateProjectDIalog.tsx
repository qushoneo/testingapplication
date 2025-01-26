import Input from "@/components/Input";
import Modal from "@/components/Modal";
import axios from "axios";
import { useState } from "react";
import { useProjectsStore } from "../useProjectsStore";

interface DialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateProjectDialog({
  isOpen,
  setIsOpen,
}: DialogProps) {
  const { addProject } = useProjectsStore();
  const [projectName, setProjectName] = useState<string>("");
  const [errors, setErrors] = useState<{ field: string; message: string }[]>(
    []
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      createProject();
    }
  };

  const resetDialogData = () => {
    setProjectName("");
    setErrors([]);
  };

  const createProject = () => {
    setErrors([]);
    if (projectName.length < 3) {
      setErrors([
        { field: "project_name", message: "at least 4 symbols required" },
      ]);
    } else {
      axios
        .post("/api/projects", {
          projectName: projectName,
        })
        .then((response) => {
          addProject(response.data);
          resetDialogData();
          setIsOpen(false);
        })
        .catch((e) => {
          setErrors(e.response.data.errors);
        });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      cancelText="Cancel"
      submitText="Create project"
      panelClassname="w-[400px] h-[270px]"
      title="Create project"
      onSubmit={createProject}
      onCancel={() => {
        setProjectName("");
        setErrors([]);
      }}
    >
      <div className="mt-[24px]">
        <Input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          minLength={3}
          label="Project name"
          onKeyDown={handleKeyDown}
          hasError={!!errors.find((error) => error.field === "project_name")}
          errorMessage={
            errors.find((error) => error.field === "project_name")?.message
          }
        />
      </div>
    </Modal>
  );
}
