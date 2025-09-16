import Modal from '@/components/Modal';
import { useModalStore } from '@/stores/useModalStore';
import { useState } from 'react';

export default function CreateTestRunModal() {
  const { isCreateTestRunOpen, closeCreateTestRun } = useModalStore();
  const [selectedOption, setSelectedOption] = useState<
    'testplan' | 'testcases'
  >('testplan');

  const handleTestPlanSelect = () => {
    setSelectedOption('testplan');
  };

  const handleTestCasesSelect = () => {
    setSelectedOption('testcases');
  };

  return (
    <Modal
      isOpen={isCreateTestRunOpen}
      setIsOpen={closeCreateTestRun}
      title='Start Test Run'
      onSubmit={() => {}}
      onCancel={closeCreateTestRun}
      panelClassname='w-[400px] h-[453px]'
    >
      <div className='space-y-4'>
        <p className='text-textPrimary mb-[24px] mt-[12px]'>
          Select an option for tests
        </p>
        <div className='flex justify-between pt-[50px]'>
          <div
            className='bg-gray rounded-[4px] p-4 cursor-pointer hover:bg-gray/80 transition-colors'
            onClick={handleTestPlanSelect}
          >
            <div className='flex items-center gap-3'>
              <input
                type='radio'
                name='testOption'
                value='testplan'
                checked={selectedOption === 'testplan'}
                onChange={handleTestPlanSelect}
                className='w-4 h-4 text-textPrimary accent-textPrimary pointer-events-none'
              />
              <span className='text-textPrimary'>Test plan</span>
            </div>
          </div>

          <div
            className='bg-gray rounded-[4px] p-4 cursor-pointer hover:bg-gray/80 transition-colors'
            onClick={handleTestCasesSelect}
          >
            <div className='flex items-center gap-3'>
              <input
                type='radio'
                name='testOption'
                value='testcases'
                checked={selectedOption === 'testcases'}
                onChange={handleTestCasesSelect}
                className='w-4 h-4 text-textPrimary accent-textPrimary pointer-events-none'
              />
              <span className='text-textPrimary'>Test cases</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
