'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import NavigationMenu from '../components/NavigationMenu';
import LeftSide from '../components/LeftSide';
import RightSide from '../components/RightSide';

import projectsRequest from '@/app/requests/projects';
import { useProjectStorageStore } from '@/stores/useProjectStorageStore';
import { use } from 'react';

export default function ProjectStorage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const [leftBarExpanded, setLeftBarExpanded] = useState<boolean>(true);

  const projectId = parseInt(use(params).projectId);

  const { setSelectedProject } = useProjectStorageStore();

  useEffect(() => {
    projectsRequest.getProjectById(projectId).then((response) => {
      setSelectedProject(response.data);
    });
  }, [projectId]);

  return (
    <ProtectedRoute
      leftSideBar={<NavigationMenu projectId={+projectId} />}
      className='ml-[0px] max-w-full w-full !overflow-hidden max-h-[100%] relative flex'
    >
      <div className='max-w-full flex max-h-[100%] w-full '>
        <>
          <LeftSide isOpen={leftBarExpanded} setIsOpen={setLeftBarExpanded} />

          <RightSide isLeftBarOpened={leftBarExpanded} />
        </>
      </div>
    </ProtectedRoute>
  );
}
