'use client';

import Button from '../../components/Button';
import ProtectedRoute from '../../components/ProtectedRoute';
import Image from 'next/image';
import { useState } from 'react';
import CreateProjectDialog from './components/CreateProjectDIalog';
import Loading from '@/components/Loading';
import NoProjects from '@/app/assets/no_projects.svg';
import { useFetch } from '@/app/hooks/useFetch';
import { useProjectsStore } from '../../stores/useProjectsStore';
import Table from '@/components/Table';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProjectStorageStore } from '@/stores/useProjectStorageStore';
import { Project } from '@/types/Project';
import projectsRequest from '@/app/requests/projects';

const ProjectsPage = () => {
  const router = useRouter();

  const [createProjectDialogOpened, setCreateProjectDialogOpened] =
    useState<boolean>(false);

  const openEditProjectWindow = () => {};

  const openProjectCreationWindow = () => {
    setCreateProjectDialogOpened(true);
  };

  const { selectedProjects, selectProject, unselectProject } =
    useProjectsStore();

  const { setSelectedProject } = useProjectStorageStore();

  const { data: projects, isLoading: isProjectsLoading } = useFetch('projects');

  const deleteProject = () => {
    projectsRequest.bulkDeleteProjects(
      selectedProjects.map((project) => project.id)
    );
  };

  const fields = [
    { name: 'Project Name', width: 'w-[15%] min-w-[230px]', value: 'name' },
    { name: 'Open defects', width: 'w-[15%] min-w-[210px]', value: 'defects' },
    { name: 'Members', width: 'w-[70%] flex-1', value: 'members' },
  ];

  return (
    <ProtectedRoute className='ml-[0px] max-w-full w-full max-h-[100%] relative flex'>
      <div className='w-full h-full px-[30px] pb-[20px] relative overflow-y-auto'>
        {isProjectsLoading ? (
          <Loading fullScreen />
        ) : (
          <>
            <div className='flex items-center gap-[4px] w-full justify-between sticky top-[0px] bg-white z-[11] h-[80px]'>
              <p className='text-2xl font-medium text-textPrimary'>Projects</p>

              <p className='p-[4px] text-xs text-textPrimary rounded-[4px] h-[24px] border border-gray min-w-[24px] text-center'>
                {projects?.length}
              </p>

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
                <div className='z-10 sticky top-[80px] bg-white'>
                  <div className='bg-lightgray h-[30px] w-full rounded-[4px] pr-[24px] pl-[32px] flex items-center gap-[12px] z-9'>
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

                <div className='w-full h-full flex flex-col z-[10]'>
                  <Table
                    className='z-[9]'
                    isSelected={(project: Project) => {
                      return selectedProjects.some((p) => p.id === project.id);
                    }}
                    data={projects}
                    fields={fields}
                    onSelect={(project: Project) => {
                      selectProject(project);
                    }}
                    onUnselect={(project: Project) => {
                      unselectProject(project.id);
                    }}
                    onRowClick={(project: Project) => {
                      setSelectedProject(project);
                      router.push(`/projects/${project.id}/storage`);
                    }}
                    renderCell={(
                      project: Project,
                      fieldValue: string,
                      fieldWidth: string
                    ): React.ReactNode => {
                      const displayingMembers = 3;
                      const remainingMembersCount =
                        project?.users?.length - displayingMembers;

                      return (
                        <>
                          {fieldValue === 'name' && (
                            <p
                              className={`text-sm text-textPrimary ${fieldWidth}`}
                            >
                              {project.name}
                            </p>
                          )}

                          {fieldValue === 'defects' && (
                            <p
                              className={`text-sm text-textPrimary ${fieldWidth}`}
                            >
                              {/* @ts-ignore */}
                              {project?.defects ? (
                                <Link
                                  href='/defects'
                                  className={`text-sm text-link underline ${fieldWidth}`}
                                  key={project.id}
                                >
                                  <p>Link to defects</p>
                                </Link>
                              ) : (
                                <p
                                  key={project.id}
                                  className={`text-sm text-textPrimary ${fieldWidth}`}
                                >
                                  No defects were found
                                </p>
                              )}
                            </p>
                          )}

                          {fieldValue === 'members' && (
                            <div className={`${fieldWidth} flex gap-[12px]`}>
                              {project?.users?.length > 0 &&
                                project.users
                                  .slice(0, displayingMembers)
                                  .map((member) => (
                                    <p key={member.id} className='text-sm'>
                                      {member.name}
                                    </p>
                                  ))}

                              {remainingMembersCount > 0 && (
                                <p className='text-[14px] p-[2px] leading-[16px] border border-gray min-w-[18px] rounded-[4px] flex items-center justify-center'>
                                  +{remainingMembersCount}
                                </p>
                              )}
                            </div>
                          )}
                        </>
                      );
                    }}
                  />
                </div>
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
          </>
        )}
      </div>

      <CreateProjectDialog
        isOpen={createProjectDialogOpened}
        setIsOpen={setCreateProjectDialogOpened}
      />
    </ProtectedRoute>
  );
};

export default ProjectsPage;
