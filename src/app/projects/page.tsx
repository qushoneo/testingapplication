'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Button from '../../components/Button';
import ProtectedRoute from '../../components/ProtectedRoute';
import WhitePlus from '@/app/assets/white_plus.svg';
import Pencil from '@/app/assets/pencil.svg';
import Trash from '@/app/assets/trash.svg';
import { useProjectsStore } from './useProjectsStore';
import ProjectsTable from './ProjectsTable';
import CreateProjectDialog from './components/CreateProjectDIalog';
import io from 'socket.io-client';

const ProjectsPage = () => {
  const {
    projects,
    setProjects,
    selectedProjects,
    removeProject,
    setSelectedProjects,
  } = useProjectsStore();

  const [createProjectDialogOpened, setCreateProjectDialogOpened] =
    useState(false);

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('PROJECT_UPDATED', (updatedProjects) => {
      setProjects(updatedProjects);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const openProjectCreationWindow = () => {
    setCreateProjectDialogOpened(true);
  };

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

        // Отправляем на сервер событие удаления проекта
        const socket = io('http://localhost:3000');
        socket.emit('DELETE_PROJECT', {
          projectIds: selectedProjects.map((project) => project.id),
          companyId: selectedProjects[0].companyId,
        });
      });
  };

  return (
    <ProtectedRoute>
      <CreateProjectDialog
        isOpen={createProjectDialogOpened}
        setIsOpen={setCreateProjectDialogOpened}
      />

      <div className='w-full h-full px-[30px] pb-[20px] relative'>
        <div className='flex gap-[8px] items-center sticky w-full top-[0px] pt-[20px] pb-[5px] bg-white z-10'>
          <p className='text-2xl font-medium text-textPrimary'>Projects</p>
          <div>
            <p className='p-[4px] text-xs text-textPrimary rounded-[4px] h-[24px] border border-gray min-w-[24px] text-center'>
              {projects.length}
            </p>
          </div>

          {selectedProjects.length > 0 && (
            <div className='flex gap-[24px] ml-[16px]'>
              <Button
                variant='gray'
                label={
                  <div className='flex items-center gap-[10px]'>
                    <Image src={Pencil} alt='edit' />
                    <p>Edit</p>
                  </div>
                }
                onClick={() => {}}
                className='w-[95px]'
              />

              <Button
                variant='gray'
                label={
                  <div className='flex items-center gap-[10px]'>
                    <Image src={Trash} alt='delete' />
                    <p>Delete</p>
                  </div>
                }
                onClick={deleteProject}
                className='w-[115px]'
              />

              <p className='flex items-center'>
                Selected: {selectedProjects.length} projects
              </p>
            </div>
          )}

          <Button
            className='ml-auto w-[170px]'
            label={
              <div className='flex items-center gap-[8px]'>
                <Image
                  className='w-[20px] h-[20px]'
                  src={WhitePlus}
                  alt='create_project'
                />
                <p className='text-white font-normal'>Create Project</p>
              </div>
            }
            onClick={openProjectCreationWindow}
          />
        </div>

        <ProjectsTable />
      </div>
    </ProtectedRoute>
  );
};

export default ProjectsPage;
