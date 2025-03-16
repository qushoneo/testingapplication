'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import React, { use } from 'react';
import NavigationMenu from '../components/NavigationMenu';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import { useModalStore } from '@/stores/useModalStore';
import CreateTestPlanModal from './components/modals/CreateTestPlanModal';
import useSWR from 'swr';
import { fetcher } from '@/app/lib/fetcher';

export default function TestPlansPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { isCreateTestPlanOpen } = useModalStore();
  const projectId = parseInt(use(params).projectId);

  const { openCreateTestPlan } = useModalStore();

  const { data: testPlans, isLoading: isTestPlanLoading } = useSWR(
    `/api/projects/${projectId}/test_plans`,
    fetcher
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
        </div>
      )}

      {isCreateTestPlanOpen && <CreateTestPlanModal />}
    </ProtectedRoute>
  );
}
