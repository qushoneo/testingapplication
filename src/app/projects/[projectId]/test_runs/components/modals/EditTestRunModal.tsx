import Input from "@/components/Input";
import Modal from "@/components/Modal";
import { useModalStore } from "@/stores/useModalStore";
import { useEffect, useState } from "react";
import testRunsRequest from "@/app/requests/testRuns";
import { AxiosError } from "axios";
import { Error } from "@/types/Error";
import { TestRun } from "@/types/TestRun";
import { TestPlan } from "@/types/TestPlan";
import { Select } from "@/components/Select";

export default function EditTestRunModal({
  projectId,
  testRuns,
  onEditSuccess,
}: {
  projectId: number;
  testRuns: TestRun[];
  testPlans: TestPlan[];
  onEditSuccess?: () => void;
}) {
  const { selectedTestRunId, closeEditTestRun } = useModalStore();

  const testRun = testRuns.find((tr: TestRun) => tr.id === selectedTestRunId);

  const [name, setName] = useState<string>(testRun?.name || "");
  const [errors, setErrors] = useState<Error[]>([]);

  useEffect(() => {
    if (testRun) {
      setName(testRun.name);
    }
  }, [testRun]);

  const updateTestRun = () => {
    if (errors.length > 0) {
      setErrors([]);
    }

    if (!testRun) {
      return;
    }

    testRunsRequest
      .updateTestRun(
        projectId,
        testRun.id,
        name,
        null, // environment
        null, // operationalSystem
        null // screenSize
      )
      .then(() => {
        closeModal();
        onEditSuccess?.();
      })
      .catch((err: AxiosError) => {
        const errorData = err.response?.data;
        if (Array.isArray(errorData)) {
          setErrors(errorData);
        } else {
          setErrors([]);
        }
      });
  };

  const closeModal = () => {
    closeEditTestRun();
  };

  return (
    <Modal
      isOpen={true}
      setIsOpen={closeModal}
      title="Edit test run"
      cancelText="Cancel"
      submitText="Edit run"
      panelClassname="w-[400px] min-h-[400px]"
      onCancel={closeModal}
      onSubmit={updateTestRun}
    >
      <div className="w-[full] h-[full] flex flex-col py-[24px] gap-[10px]">
        <Input
          className="w-[full] h-[30px]"
          label="Test run name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          errors={errors}
          fieldName="name"
        />

        <Select
          label="Environment"
          options={[]}
          value={null}
          setValue={() => {}}
          disabled={true}
        />

        <Select
          label="Operation system"
          options={[]}
          value={null}
          setValue={() => {}}
          disabled={true}
        />

        <Select
          label="Screen size"
          options={[]}
          value={null}
          setValue={() => {}}
          disabled={true}
        />
      </div>
    </Modal>
  );
}
