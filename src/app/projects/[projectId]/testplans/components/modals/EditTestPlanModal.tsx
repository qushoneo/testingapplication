import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import TextArea from '@/components/TextArea';
import { useModalStore } from '@/stores/useModalStore';
import { useEffect, useState } from 'react';
import SelectTestCasesModal from './SelectTestCasesModal';
import useSelectedTestCasesStore from '@/stores/useTestCasesStore';
import testPlansRequest from '@/app/requests/testPlans';
import { mutate } from 'swr';
import { AxiosError } from 'axios';
import { Error } from '@/types/Error';
import { TestCase } from '@prisma/client';
import { TestPlan } from '@/types/TestPlan';

export default function EditTestPlanModal({
  projectId,
  testPlans,
}: {
  projectId: number;
  testPlans: TestPlan[];
}) {
  const {
    openSelectTestCases,
    isSelectTestCasesOpen,
    selectedTestPlanId,
    closeEditTestPlan,
  } = useModalStore();

  const testPlan = testPlans.find(
    (tp: TestPlan) => tp.id === selectedTestPlanId
  );

  const [name, setName] = useState<string>(testPlan?.name || '');
  const [description, setDescription] = useState<string>(
    testPlan?.description || ''
  );
  const [errors, setErrors] = useState<Error[]>([]);
  const { selectedTestCases, setSelectedTestCases } =
    useSelectedTestCasesStore();

  useEffect(() => {
    if (testPlan) {
      setSelectedTestCases(testPlan.testCases);
    }
  }, [testPlan]);

  const updateTestPlan = () => {
    if (errors.length > 0) {
      setErrors([]);
    }

    if (!testPlan) {
      return;
    }

    testPlansRequest
      .updateTestPlan(
        projectId,
        testPlan.id,
        name,
        description,
        selectedTestCases.map((testCase) => testCase.id)
      )
      .then(() => {
        closeModal();
      })
      .catch((err: AxiosError) => {
        setErrors(err.response?.data as Error[]);
      });
  };

  const closeModal = () => {
    setSelectedTestCases([]);
    closeEditTestPlan();
  };

  return (
    <Modal
      isOpen={true}
      setIsOpen={closeModal}
      title='Edit test plan'
      cancelText='Cancel'
      submitText='Edit plan'
      panelClassname='w-[400px] h-[410px]'
      onCancel={closeModal}
      onSubmit={updateTestPlan}
    >
      <div className='w-[full] h-[full] flex flex-col py-[24px] gap-[10px]'>
        <Input
          className='w-[full] h-[30px]'
          label='Test plan name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          errors={errors}
          fieldName='name'
        />

        <TextArea
          className='w-[full] h-[100px]'
          label='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={255}
        />

        {selectedTestCases.length > 0 && (
          <p className='text-[14px] '>
            {selectedTestCases.length} test cases selected
          </p>
        )}

        <Button
          label='Add cases'
          icon='black_plus'
          variant='gray'
          className='w-[112px] text-[14px] gap-[6px]'
          disabled={!testPlan}
          onClick={() => {
            openSelectTestCases();
          }}
        />
      </div>

      {isSelectTestCasesOpen && projectId && (
        <SelectTestCasesModal projectId={projectId.toString()} />
      )}
    </Modal>
  );
}
