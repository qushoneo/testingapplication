'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import React, { use } from 'react';
import NavigationMenu from '../components/NavigationMenu';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import { useModalStore } from '@/stores/useModalStore';
import CreateTestPlanModal from './components/modals/CreateTestPlanModal';
import { useFetch } from '@/app/hooks/useFetch';
import ProjectsTable from '../../ProjectsTable';
import TestPlansTable from './TestPlansTable';

export default function TestPlansPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { isCreateTestPlanOpen } = useModalStore();
  const projectId = parseInt(use(params).projectId);

  const fields = [
    { name: 'Plan Name', width: 'w-[15%] min-w-[230px]' },
    { name: 'Test cases', width: 'w-[15%] min-w-[210px]' },
    { name: 'Description', width: 'w-[70%] flex-1' },
  ];

  const { openCreateTestPlan } = useModalStore();

  const { data: testPlans, isLoading: isTestPlanLoading } = useFetch(
    `projects/${projectId}/test_plans`
  );

  if (isTestPlanLoading) {
    return <Loading />;
  }

  return (
    <ProtectedRoute
      leftSideBar={<NavigationMenu projectId={+projectId} />}
      className='ml-[0px] max-w-full w-full !overflow-hidden max-h-[100%] relative flex'
    >
      {isTestPlanLoading ? (
        <Loading offset={{ left: 140 }} />
      ) : (
        <div
          className={`p-[20px] pr-[30px] justify-between items-center gap-[4px] sticky top-0 bg-white max-h-[100%] w-full`}
        >
          <div className='flex items-center gap-[4px] w-full justify-between'>
            <div className='flex items-center gap-[4px]'>
              <p
                className={`whitespace-nowrap ellipsis text-ellipsi font-medium text-[24px]`}
              >
                Test Plans
              </p>

              <div
                className={`p-[2px] rounded-[4px] border border-gray min-w-[24px] flex items-center justify-center ml-[4px]`}
              >
                <p className='text-[12px] '>{testPlans?.length}</p>
              </div>
            </div>

            <div className='flex items-center gap-[24px] max-h-[100%]'>
              <Button
                onClick={() => {
                  openCreateTestPlan();
                }}
                className='min-w-fit w-[150px] ml-[auto]'
                label='Create plan'
                icon='white_plus'
                iconSize={24}
              />
            </div>
          </div>

          {testPlans.length > 0 ? (
            <>
              <div className='z-10 sticky top-[65px] pt-[20px] bg-white'>
                <div className='bg-lightgray h-[30px] w-full rounded-[4px] pr-[24px] pl-[32px] flex items-center gap-[12px] '>
                  {fields.map((field, i) => (
                    <p
                      key={i}
                      className={`text-lg ${field.width} text-textPrimary font-medium`}
                    >
                      {field.name}
                    </p>
                  ))}
                </div>
              </div>

              <TestPlansTable projectId={projectId} />
            </>
          ) : (
            <div className='flex justify-center items-center h-full pt-[40px] flex-col gap-[16px]'>
              <p className='text-textPrimary text-[18px] font-medium'>
                You don't have any projects yet
              </p>

              {/* <Button
                label={'Create Project'}
                icon='white_plus'
                iconSize={24}
                onClick={openProjectCreationWindow}
                className='w-[170px]'
              /> */}
            </div>
          )}
        </div>
      )}

      {isCreateTestPlanOpen && <CreateTestPlanModal projectId={projectId} />}
    </ProtectedRoute>
  );
}
