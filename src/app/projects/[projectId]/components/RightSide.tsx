'use client';

import Button from '@/components/Button';
import ProjectFolder from './ProjectFolder';
import CreateFolderDialog from './modals/CreateFolderDialog';

import CreateTestCaseDialog from './modals/CreateTestCaseDialog';
import EditFolderModal from './modals/EditFolderDialog';
import DeleteFolderDialog from './modals/DeleteFolderDialog';
import testCasesRequest from '@/app/requests/testCases';
import { useFoldersStore } from '@/stores/useFoldersStore';
import { useTestCasesStore } from '@/stores/useTestCasesStore';
import { useProjectStorageStore } from '@/stores/useProjectStorageStore';
import { useModalStore } from '@/stores/useModalStore';
import { useEffect } from 'react';
import projectsRequest from '@/app/requests/projects';
import { useProjectsStore } from '@/stores/useProjectsStore';
import folderRequests from '@/app/requests/folders';
import Loading from '@/components/Loading';

type RightSideProps = {
  isLeftBarOpened: boolean;
};

export default function RightSide({ isLeftBarOpened }: RightSideProps) {
  const { selectedProject, setSelectedProject } = useProjectStorageStore();
  const {
    testCases,
    removeTestCases,
    addTestCases,
    selectedTestCases,
    setTestCases,
    isTestCaseLoading,
    setIsTestCaseLoading,
  } = useTestCasesStore();

  const { folders, setFolders, setIsFolderLoading, isFolderLoading } =
    useFoldersStore();

  const {
    openCreateFolder,
    openCreateTestCase,
    isCreateFolderOpen,
    isCreateTestCaseOpen,
    isDeleteFolderOpen,
    isEditFolderOpen,
  } = useModalStore();

  useEffect(() => {
    setIsFolderLoading(true);
    setIsTestCaseLoading(true);

    if (selectedProject) {
      Promise.all([
        folderRequests.getFoldersByProjectId(selectedProject.id),
        testCasesRequest.getAllTestCases(selectedProject.id),
      ]).then(([folders, testCases]) => {
        setFolders(folders.data);
        setTestCases(testCases.data);

        setIsFolderLoading(false);
        setIsTestCaseLoading(false);
      });
    }
  }, [selectedProject]);

  if (!selectedProject) {
    return <></>;
  }

  const deleteSelectedTestCases = () => {
    testCasesRequest
      .deleteBulk(
        selectedTestCases.map(({ id }) => id),
        selectedProject.id
      )
      .then(() => {
        removeTestCases(selectedTestCases);
      });
  };

  const duplicateTestCases = () => {
    testCasesRequest
      .duplicateTestCases(
        selectedTestCases.map(({ id }) => id),
        selectedProject.id
      )
      .then((response) => {
        addTestCases(response.data);
      });
  };

  if (isFolderLoading || isTestCaseLoading) {
    return <Loading fullScreen />;
  }

  return (
    <div
      className={`h-full border-r border-gray relative transition-[200ms] w-full max-w-full overflow-x-hidden max-h-[100%]`}
    >
      <div
        className={`p-[20px] pr-[30px] flex ${
          isLeftBarOpened ? 'justify-end' : 'justify-between'
        } items-center gap-[4px] sticky top-0 bg-white z-10 max-h-[100%]`}
      >
        {!isLeftBarOpened && (
          <div className='flex items-center gap-[4px]'>
            <p
              className={` ${
                isLeftBarOpened ? 'overflow-hidden' : ''
              } whitespace-nowrap ellipsis text-ellipsi font-medium text-[24px]`}
            >
              {selectedProject?.name}
            </p>
            <p className='font-medium text-[24px]'> storage</p>
            <div
              className={`p-[2px] rounded-[4px] border border-gray min-w-[24px] flex items-center justify-center ml-[4px]`}
            >
              <p className='text-[12px] '>{folders?.length}</p>
            </div>
          </div>
        )}

        <div className='justify-between flex w-full'>
          <div className='flex items-center gap-[24px]'>
            {selectedTestCases.length > 0 && (
              <>
                {selectedTestCases.length === 1 && (
                  <Button
                    variant='gray'
                    icon='pencil'
                    label='Edit'
                    onClick={() => {}}
                    className='w-[95px]'
                  />
                )}

                <Button
                  variant='gray'
                  label='Delete'
                  icon='trash'
                  onClick={() => {
                    deleteSelectedTestCases();
                  }}
                  className='w-[115px]'
                />

                <Button
                  variant='gray'
                  icon='duplicate'
                  label='Duplicate'
                  onClick={() => {
                    duplicateTestCases();
                  }}
                  className='w-[135px]'
                />
              </>
            )}
          </div>

          <div className='flex items-center gap-[24px] max-h-[100%]'>
            <Button
              className='min-w-[160px]'
              onClick={() => {
                openCreateFolder();
              }}
              label={'Create Folder'}
              icon={'white_plus'}
              iconSize={24}
            />

            <Button
              onClick={() => {
                openCreateTestCase();
              }}
              className='min-w-fit'
              label='Create test case'
              icon='white_plus'
              iconSize={24}
            />
          </div>
        </div>
      </div>

      <div className='w-full pl-[20px] pr-[30px] max-w-full overflow-auto'>
        {folders
          .filter((folder) => folder.parentId === null)
          .map((folder) => (
            <ProjectFolder key={'parent-' + folder.id} folder={folder} />
          ))}
      </div>

      {isCreateFolderOpen && <CreateFolderDialog />}

      {isDeleteFolderOpen && <DeleteFolderDialog />}

      {isCreateTestCaseOpen && <CreateTestCaseDialog />}

      {isEditFolderOpen && <EditFolderModal />}
    </div>
  );
}
