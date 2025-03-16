'use client';

import Button from '../../components/Button';
import ProtectedRoute from '../../components/ProtectedRoute';
import Image from 'next/image';
import { useProjectsStore } from '../../stores/useProjectsStore';
import ProjectsTable from './ProjectsTable';
import { Suspense, useEffect, useState } from 'react';
import CreateProjectDialog from './components/CreateProjectDIalog';
import axios from 'axios';
import Loading from '@/components/Loading';
import projectsRequest from '../requests/projects';
import NoProjects from '@/app/assets/no_projects.svg';
const ProjectsPage = () => {
  const {
    isLoading,
    projects,
    selectedProjects,
    removeProject,
    setSelectedProjects,
    setIsLoading,
    setProjects,
  } = useProjectsStore();
  const [createProjectDialogOpened, setCreateProjectDialogOpened] =
    useState<boolean>(false);

  const openEditProjectWindow = () => {};

  const openProjectCreationWindow = () => {
    setCreateProjectDialogOpened(true);
  };

  useEffect(() => {
    setIsLoading(true);
    projectsRequest.getAllProjects().then((response) => {
      setProjects(response.data);
      setIsLoading(false);
    });
  }, []);

  const deleteProject = () => {
    axios
      .delete('/api/projects', {
        data: {
          projectIds: selectedProjects.map((project) => project.id),
        },
      })
      .then((response) => {
        response.data.projectIds.forEach((id: number) => {
          removeProject(id);
        });

        setSelectedProjects([]);
      });
  };

  const fields = [
    { name: 'Project Name', width: 'w-[15%] min-w-[230px]' },
    { name: 'Open defects', width: 'w-[15%] min-w-[210px]' },
    { name: 'Members', width: 'w-[70%] flex-1' },
  ];

  return (
    <ProtectedRoute>
      <div className='w-full h-full px-[30px] pb-[20px] relative'>
        <Suspense fallback={<Loading fullScreen />}>
          <div className='flex gap-[8px] items-center sticky w-full top-[0px] pt-[20px] pb-[5px] bg-white z-10'>
            <p className='text-2xl font-medium text-textPrimary'>Projects</p>
            <div>
              <p className='p-[4px] text-xs text-textPrimary rounded-[4px] h-[24px] border border-gray min-w-[24px] text-center'>
                {projects?.length}
              </p>
            </div>

            <>
              {selectedProjects.length > 0 && (
                <div className='flex gap-[24px] ml-[16px]'>
                  <Button
                    variant='gray'
                    icon='pencil'
                    label={'Edit'}
                    onClick={openEditProjectWindow}
                    className='w-[95px]'
                    iconSize={24}
                  />

                  <Button
                    variant='gray'
                    icon='trash'
                    label={'Delete'}
                    onClick={deleteProject}
                    className='w-[115px]'
                    iconSize={24}
                  />

                  <p className='flex items-center'>
                    Selected: {selectedProjects.length} projects
                  </p>
                </div>
              )}
            </>

            <Button
              className='ml-auto w-[170px]'
              label={'Create Project'}
              icon='white_plus'
              iconSize={24}
              onClick={openProjectCreationWindow}
            />
          </div>

          {projects.length > 0 ? (
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
              <ProjectsTable />
            </>
          ) : (
            <div className='flex justify-center items-center h-full pt-[40px] flex-col gap-[16px]'>
              <Image src={NoProjects} alt='No Projects' />

              <p className='text-textPrimary text-[18px] font-medium'>
                You don't have any projects yet
              </p>

              <Button
                label={'Create Project'}
                icon='white_plus'
                iconSize={24}
                onClick={openProjectCreationWindow}
                className='w-[170px]'
              />
            </div>
          )}
        </Suspense>
      </div>

      <CreateProjectDialog
        isOpen={createProjectDialogOpened}
        setIsOpen={setCreateProjectDialogOpened}
      />
    </ProtectedRoute>
  );
};

export default ProjectsPage;
