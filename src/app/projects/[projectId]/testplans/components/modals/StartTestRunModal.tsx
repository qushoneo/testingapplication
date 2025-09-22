import Input from "@/components/Input";
import Modal from "@/components/Modal";
import { useModalStore } from "@/stores/useModalStore";
import { useState } from "react";
import useSelectedTestCasesStore from "@/stores/useTestCasesStore";
import { AxiosError } from "axios";
import { Error } from "@/types/Error";
import { Select } from "@/components/Select";
import testRunsRequest from "@/app/requests/testRuns";
import { useAuth } from "@/context/AuthProvider";

export default function StartTestRunModal({
  projectId,
}: {
  projectId: number;
}) {
  const {
    closeStartTestRun,
    openSelectTestCases,
    isSelectTestCasesOpen,
    selectedTestPlanId,
  } = useModalStore();
  const { user } = useAuth();
  const [name, setName] = useState<string>(
    "Test run " + new Date().toLocaleDateString()
  );
  const [errors, setErrors] = useState<Error[]>([]);
  const { selectedTestCases, setSelectedTestCases } =
    useSelectedTestCasesStore();

  const createTestRun = () => {
    if (errors.length > 0) {
      setErrors([]);
    }

    testRunsRequest
      .createTestRun({
        projectId,
        name,
        userId: user?.id!,
        testPlanId: selectedTestPlanId!,
        status: "inProgress",
        testCaseIds: selectedTestCases.map((testCase) => testCase.id),
      })
      .then(() => {
        closeModal();
      })
      .catch((err: AxiosError) => {
        setErrors(err.response?.data as Error[]);
      });
  };

  const closeModal = () => {
    setSelectedTestCases([]);
    closeStartTestRun();
  };

  return (
    <Modal
      isOpen={true}
      setIsOpen={closeStartTestRun}
      title="Start test run"
      cancelText="Cancel"
      submitText="Start run"
      panelClassname="w-[400px] min-h-[410px]"
      onCancel={closeModal}
      onSubmit={createTestRun}
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
