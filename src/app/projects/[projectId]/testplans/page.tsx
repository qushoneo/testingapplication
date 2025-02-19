'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import React, { use, useEffect, useState } from 'react';
import NavigationMenu from '../components/NavigationMenu';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import { useTestPlansStore } from '@/stores/useTestPlansStore';
import testPlansRequest from '@/app/requests/testPlans';
import { useModalStore } from '@/stores/useModalStore';
import projectsRequest from '@/app/requests/projects';
import folderRequests from '@/app/requests/folders';
import testCasesRequest from '@/app/requests/testCases';
import { useFoldersStore } from '@/stores/useFoldersStore';
import { useTestCasesStore } from '@/stores/useTestCasesStore';

export default function TestPlansPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { testPlans, setTestPlans, setSelectedProject } = useTestPlansStore();
  const { isCreateTestPlanOpen } = useModalStore();
  const projectId = parseInt(use(params).projectId);

  const { openCreateTestPlan } = useModalStore();
  const { setFolders, setIsFolderLoading, isFolderLoading } = useFoldersStore();
  const { setTestCases, setIsTestCaseLoading, isTestCaseLoading } =
    useTestCasesStore();

  useEffect(() => {
    setIsFolderLoading(true);
    setIsTestCaseLoading(true);

    if (projectId) {
      Promise.all([
        folderRequests.getFoldersByProjectId(projectId),
        testCasesRequest.getAllTestCases(projectId),
      ]).then(([folders, testCases]) => {
        setFolders(folders.data);
        setTestCases(testCases.data);

        setIsFolderLoading(false);
        setIsTestCaseLoading(false);
      });
    }
  }, [projectId]);

  return (
    <ProtectedRoute
      leftSideBar={<NavigationMenu projectId={+projectId} />}
      className='ml-[0px] max-w-full w-full !overflow-hidden max-h-[100%] relative flex'
    >
      {isFolderLoading || isTestCaseLoading ? (
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
    </ProtectedRoute>
  );
}
