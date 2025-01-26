import Input from "@/components/Input";
import Modal from "@/components/Modal";
import axios from "axios";
import { useState } from "react";

interface DialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateProjectDialog({
  isOpen,
  setIsOpen,
}: DialogProps) {
  const [projectName, setProjectName] = useState<string>("");

  const createProject = () => {
    axios
      .post("/api/projects", {
        projectName: projectName,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((e) => console.log(e));
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
    >
      <div className="mt-[24px]">
        <Input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          minLength={3}
          label="Project name"
        />
      </div>
    </Modal>
  );
}
