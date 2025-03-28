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
export default function CreateTestPlanModal({
  projectId,
}: {
  projectId: number;
}) {
  const { closeCreateTestPlan, openSelectTestCases, isSelectTestCasesOpen } =
    useModalStore();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const { selectedTestCases, setSelectedTestCases } =
    useSelectedTestCasesStore();

  return (
    <Modal
      isOpen={true}
      setIsOpen={closeCreateTestPlan}
      title='Create test plan'
      cancelText='Cancel'
      submitText='Create plan'
      panelClassname='w-[400px] h-[410px]'
      onCancel={() => {
        setSelectedTestCases([]);
      }}
      onSubmit={() => {
        testPlansRequest
          .createTestPlan(
            projectId,
            name,
            description,
            selectedTestCases.map((testCase) => testCase.id)
          )
          .then((res) => {
            mutate(`/api/projects/${projectId}/test_plans`, (data: any) => [
              ...data,
              res.data,
            ]);
          });
      }}
    >
      <div className='w-[full] h-[full] flex flex-col py-[24px] gap-[10px]'>
        <Input
          className='w-[full] h-[30px]'
          label='Test plan name'
          value={name}
          onChange={(e) => setName(e.target.value)}
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
