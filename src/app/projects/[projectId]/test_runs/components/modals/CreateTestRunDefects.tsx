"use client";

import { useModalStore } from "@/stores/useModalStore";
import Modal from "@/components/Modal";
import { useState } from "react";
import TextArea from "@/components/TextArea";
import { Select } from "@/components/Select";
import { severities, severityIcons } from "@/app/lib/severities";
import { User } from "@/types/User";
import UserAvatar from "@/components/UserAvatar";
import { useFetch } from "@/app/hooks/useFetch";
import Button from "@/components/Button";

type SelectedSeverity = {
  id: string | null;
  name: string;
};

type Defect = {
  id: number;
  description: string | null;
  severity: SelectedSeverity | null;
  assignee: User | null;
};

type CreateTestRunDefectsProps = {
  testCaseName?: string;
  testRunId?: number;
};

export default function CreateTestRunDefects({
  testCaseName,
  testRunId,
}: CreateTestRunDefectsProps) {
  const { isCreateDefectOpen, closeCreateDefect } = useModalStore();
  const [nextId, setNextId] = useState(2);
  const [defects, setDefects] = useState<Defect[]>([
    {
      id: 1,
      description: null,
      severity: severities[0] || null,
      assignee: null,
    },
  ]);

  const resetStates = () => {
    setDefects([
      {
        id: 1,
        description: null,
        severity: severities[0] || null,
        assignee: null,
      },
    ]);
    setNextId(2);
  };

  const handleClose = () => {
    resetStates();
    closeCreateDefect();
  };

  const { data: users } = useFetch("/users");

  const userIcons =
    users?.map((user: User) => ({
      id: user.id,
      icon: <UserAvatar user={user} />,
    })) || [];

  const addDefect = () => {
    const newDefect: Defect = {
      id: nextId,
      description: null,
      severity: severities[0] || null,
      assignee: null,
    };
    setDefects([newDefect, ...defects]);
    setNextId(nextId + 1);
  };

  const updateDefect = (id: number, field: keyof Defect, value: any) => {
    setDefects(
      defects.map((defect) =>
        defect.id === id ? { ...defect, [field]: value } : defect
      )
    );
  };

  return (
    <Modal
      isOpen={isCreateDefectOpen}
      setIsOpen={handleClose}
      title="Create defect"
      panelClassname="w-[400px] max-h-[600px] flex flex-col"
    >
      <div className="mt-[24px] mb-[24px]">
        <Button
          label="Add another defect"
          icon="black_plus"
          iconSize={16}
          variant="gray"
          className="w-[167px] px-[8px] text-[14px]"
          onClick={addDefect}
        />
      </div>

      <div className="overflow-y-auto space-y-[20px] mb-[32px]">
        {defects.map((defect) => (
          <div
            key={defect.id}
            className={`${
              defects.length > 1
                ? "bg-lightgray p-[16px] pt-[12px] rounded-[8px] w-[302px]"
                : ""
            }`}
          >
            {defects.length > 1 && (
              <p className="text-[18px] mb-[12px]">Defect #{defect.id}</p>
            )}
            <div className="space-y-[10px]">
              <TextArea
                label="Description"
                value={defect.description || ""}
                onChange={(e) =>
                  updateDefect(defect.id, "description", e.target.value)
                }
              />

              <Select
                label="Severity"
                options={severities}
                value={defect.severity}
                setValue={(value) => updateDefect(defect.id, "severity", value)}
                showIconsByValue={true}
                icons={severityIcons}
              />

              <div>
                <Select
                  label="Assignee"
                  options={users}
                  value={defect.assignee}
                  setValue={(value) =>
                    updateDefect(defect.id, "assignee", value)
                  }
                  showIconsByValue={true}
                  icons={userIcons}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-[16px] mt-auto ">
        <Button label="Skip" className="w-[63px] " variant="outlined" />
        <Button
          label="Create defect"
          className="w-[134px]"
          onClick={() => {}}
        />
      </div>
    </Modal>
  );
}
