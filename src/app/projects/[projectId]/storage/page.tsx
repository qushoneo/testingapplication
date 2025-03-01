'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import NavigationMenu from '../components/NavigationMenu';
import LeftSide from '../components/LeftSide';
import RightSide from '../components/RightSide';

import testCasesRequest from '@/app/requests/testCases';
import folderRequests from '@/app/requests/folders';
import projectsRequest from '@/app/requests/projects';
import { use } from 'react';
import Loading from '@/components/Loading';
import { useFoldersStore } from '@/stores/useFoldersStore';
import { useTestCasesStore } from '@/stores/useTestCasesStore';
import { useProjectStorageStore } from '@/stores/useProjectStorageStore';

export default function ProjectStorage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const router = useRouter();

  const [leftBarExpanded, setLeftBarExpanded] = useState<boolean>(true);

  const projectId = parseInt(use(params).projectId);

  const { setSelectedProject } = useProjectStorageStore();
  const { setTestCases, setIsTestCaseLoading, isTestCaseLoading } =
    useTestCasesStore();

  const { setFolders, setIsFolderLoading, isFolderLoading } = useFoldersStore();

  useEffect(() => {
    projectsRequest.getProjectById(projectId).then((response) => {
      setSelectedProject(response.data);
    });
  }, [projectId]);

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
      <div className='max-w-full flex max-h-[100%] w-full '>
        {isFolderLoading || isTestCaseLoading ? (
          <Loading />
        ) : (
          <>
            <LeftSide isOpen={leftBarExpanded} setIsOpen={setLeftBarExpanded} />

            <RightSide isLeftBarOpened={leftBarExpanded} />
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
