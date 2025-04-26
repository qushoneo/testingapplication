import ProtectedRoute from '@/components/ProtectedRoute';
import { TestPlan } from '@/types/TestPlan';
import Image from 'next/image';
import ArrowLeft from '@/app/assets/arrow_down.svg';
import { useState, useEffect } from 'react';
import { TestCase } from '@prisma/client';
import { useFetch } from '@/app/hooks/useFetch';
import { Folder } from '@/types/Folder';
import ProjectFolder from '../../../components/ProjectFolder';
import Loading from '@/components/Loading';
import NoProjects from '@/app/assets/no_projects.svg';
import Button from '@/components/Button';
import { useModalStore } from '@/stores/useModalStore';
import CreateTestRunModal from '../modals/CreateTestRunModal';

type TestPlanRecoveryProps = {
  testPlan: TestPlan;
  closeRecovery: () => void;
};

export default function TestPlanRecovery({
  testPlan,
  closeRecovery,
}: TestPlanRecoveryProps) {
  const [recoveryMode, setRecoveryMode] = useState<'test_cases' | 'test_runs'>(
    'test_cases'
  );

  const { data: folders, isLoading: isFolderLoading } = useFetch(
    `projects/${testPlan.projectId}/folders`
  );

  const { openCreateTestRun, isCreateTestRunOpen } = useModalStore();

  const testRuns = [];
  const isTestRunLoading = false;

  const foldersWithTestCases = (testCases: TestCase[]) => {
    const foldersIds = Array.from(
      new Set(testCases.map((testCase: TestCase) => testCase.folderId))
    );

    return foldersIds.map((folderId: number) => {
      return folders.find((folder: Folder) => folderId === folder.id);
    });
  };

  if (isFolderLoading) {
    return <Loading />;
  }

  return (
    <ProtectedRoute className='px-[30px] pb-[20px] flex flex-col gap-[20px]'>
      <div className='flex flex-col gap-[20px] sticky top-[0px] pt-[20px] z-[10] bg-white'>
        <div className='w-full h-[40px] flex items-center gap-[8px]'>
          <Image
            src={ArrowLeft}
            alt='arrow-left'
            className='w-[20px] h-[20px] transform rotate-90 cursor-pointer'
            onClick={() => {
              closeRecovery();
            }}
          />

          <p className='text-textPrimary text-[24px] font-medium'>
            Recovery test plan
          </p>
        </div>

        <div className='w-full h-[40px] bg-[lightgray] rounded-[4px]'>
          <div className='w-full h-full flex items-center gap-[4px] px-[4px]'>
            <div
              className={`w-[95px] h-[32px] rounded-[4px] flex items-center justify-center cursor-pointer ${
                recoveryMode === 'test_cases' ? 'bg-white' : 'bg-[lightgray]'
              }`}
              onClick={() => setRecoveryMode('test_cases')}
            >
              <p className='text-textPrimary text-[14px] '>Test cases</p>
            </div>

            <div
              className={`w-[86px] h-[32px] rounded-[4px] flex items-center justify-center cursor-pointer ${
                recoveryMode === 'test_runs' ? 'bg-white' : 'bg-[lightgray]'
              }`}
              onClick={() => setRecoveryMode('test_runs')}
            >
              <p className='text-textPrimary text-[14px] '>Test runs</p>
            </div>
          </div>
        </div>
      </div>

      {recoveryMode === 'test_cases' &&
        foldersWithTestCases(testPlan.testCases || []).map((folder: Folder) => (
          <ProjectFolder
            key={folder.id}
            folder={folder}
            testCases={testPlan.testCases || []}
            mode='show'
            disableChildrenFolders={true}
          />
        ))}

      {recoveryMode === 'test_runs' &&
        (testRuns.length > 0 ? (
          <div className='w-full h-full flex flex-col gap-[20px]'>{/*  */}</div>
        ) : (
          <div className='w-full h-full flex flex-col gap-[16px] mt-[40px] items-center'>
            <Image src={NoProjects} alt='No Projects' />

            <p className='text-textPrimary text-[24px] font-medium'>
              You don't have any Test runs yet
            </p>

            <Button
              label='Start run'
              className='w-[130px] mt-[4px]'
              icon={'play'}
              onClick={openCreateTestRun}
            />
          </div>
        ))}

      {isCreateTestRunOpen && <CreateTestRunModal />}
    </ProtectedRoute>
  );
}
