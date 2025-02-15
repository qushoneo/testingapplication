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
  const { setFolders } = useFoldersStore();
  const { setTestCases } = useTestCasesStore();

  useEffect(() => {
    projectsRequest.getProjectById(projectId).then((response) => {
      setSelectedProject(response.data);
    });
  }, [projectId]);

  return (
    <ProtectedRoute
      leftSideBar={<NavigationMenu projectId={+projectId} />}
      className='ml-[0px] max-w-full w-full justify-end !overflow-hidden max-h-[100%] relative flex'
    >
      <div className='max-w-[calc(100%-140px)] flex max-h-[100%] w-full '>
        <LeftSide isOpen={leftBarExpanded} setIsOpen={setLeftBarExpanded} />

        <RightSide isLeftBarOpened={leftBarExpanded} />
      </div>
    </ProtectedRoute>
  );
}
