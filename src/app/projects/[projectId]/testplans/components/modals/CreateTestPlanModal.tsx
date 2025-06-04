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

export default function CreateTestPlanModal({
  projectId,
}: {
  projectId: number;
}) {
  const { closeCreateTestPlan, openSelectTestCases, isSelectTestCasesOpen } =
    useModalStore();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<Error[]>([]);
  const { selectedTestCases, setSelectedTestCases } =
    useSelectedTestCasesStore();

  const createTestPlan = () => {
    if (errors.length > 0) {
      setErrors([]);
    }

    testPlansRequest
      .createTestPlan(
        projectId,
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
    closeCreateTestPlan();
  };

  return (
    <Modal
      isOpen={true}
      setIsOpen={closeCreateTestPlan}
      title='Create test plan'
      cancelText='Cancel'
      submitText='Create plan'
      panelClassname='w-[400px] min-h-[410px]'
      onCancel={closeModal}
      onSubmit={createTestPlan}
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
