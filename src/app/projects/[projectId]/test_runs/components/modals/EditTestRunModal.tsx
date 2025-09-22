import Input from "@/components/Input";
import Modal from "@/components/Modal";
import { useModalStore } from "@/stores/useModalStore";
import { useEffect, useState } from "react";
import testRunsRequest from "@/app/requests/testRuns";
import { AxiosError } from "axios";
import { Error } from "@/types/Error";
import { TestRun } from "@/types/TestRun";
import { TestPlan } from "@/types/TestPlan";

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

        <div className="flex flex-col gap-[10px]">
          <div>
            <p className="text-textPrimary mb-[4px] text-xs">Environment</p>
            <div className="w-[100%] h-[35px] border border-gray rounded-[4px] px-[12px] flex items-center bg-gray">
              <p className="text-sm text-textPrimary opacity-50">
                Not specified
              </p>
            </div>
          </div>

          <div>
            <p className="text-textPrimary mb-[4px] text-xs">
              Operational System
            </p>
            <div className="w-[100%] h-[35px] border border-gray rounded-[4px] px-[12px] flex items-center bg-gray">
              <p className="text-sm text-textPrimary opacity-50">
                Not specified
              </p>
            </div>
          </div>

          <div>
            <p className="text-textPrimary mb-[4px] text-xs">Screen Size</p>
            <div className="w-[100%] h-[35px] border border-gray rounded-[4px] px-[12px] flex items-center bg-gray">
              <p className="text-sm text-textPrimary opacity-50">
                Not specified
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
