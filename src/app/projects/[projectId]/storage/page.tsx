'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import React, { useEffect, useState } from 'react';
import NavigationMenu from '../components/NavigationMenu';
import LeftSide from '../components/LeftSide';
import RightSide from '../components/RightSide';

import { useProjectStorageStore } from '@/stores/useProjectStorageStore';
import { use } from 'react';
import { useFetch } from '@/app/hooks/useFetch';
import Loading from '@/components/Loading';

export default function ProjectStorage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const [leftBarExpanded, setLeftBarExpanded] = useState<boolean>(true);

  const projectId = parseInt(use(params).projectId);

  const { setSelectedProject } = useProjectStorageStore();

  const { data: project, isLoading: isProjectLoading } = useFetch(
    `projects/${projectId}`
  );

  useEffect(() => {
    if (project) {
      setSelectedProject(project);
    }
  }, [project]);

  return (
    <ProtectedRoute
      leftSideBar={<NavigationMenu projectId={+projectId} />}
      className='ml-[0px] max-w-full w-full !overflow-hidden max-h-[100%] relative flex'
    >
      <div className='max-w-full flex max-h-[100%] w-full '>
        {isProjectLoading ? (
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
