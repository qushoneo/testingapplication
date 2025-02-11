'use client';

import Image from 'next/image';
import { useSelectedProjectStore } from '../store/useSelectedProjectStore';
import Button from '@/components/Button';
import WhitePlus from '@/app/assets/white_plus.svg';
import ProjectFolder from './ProjectFolder';
import CreateFolderDialog from './modals/CreateFolderDialog';
import { useModalStore } from '../store/useModalStore';
import CreateTestCaseDialog from './modals/CreateTestCaseDialog';
import EditFolderModal from './modals/EditFolderDialog';
import DeleteFolderDialog from './modals/DeleteFolderDialog';
import Pencil from '@/app/assets/pencil.svg';
import Trash from '@/app/assets/trash.svg';
import testCasesRequest from '@/app/requests/testCases';

type RightSideProps = {
  isLeftBarOpened: boolean;
};

export default function RightSide({ isLeftBarOpened }: RightSideProps) {
  const {
    selectedProject,
    projectFolders,
    selectedTestCases,
    removeTestCases,
  } = useSelectedProjectStore();

  const {
    openCreateFolder,
    openCreateTestCase,
    isCreateFolderOpen,
    isCreateTestCaseOpen,
    isDeleteFolderOpen,
    isEditFolderOpen,
  } = useModalStore();
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
              <p className='text-[12px] '>{projectFolders?.length}</p>
            </div>
          </div>
        )}

        <div className='justify-between flex w-full'>
          <div className='flex items-center'>
            {selectedTestCases.length > 0 && (
              <>
                {selectedTestCases.length === 1 && (
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
                )}

                <Button
                  variant='gray'
                  label={
                    <div className='flex items-center gap-[10px]'>
                      <Image src={Trash} alt='edit' />
                      <p>Delete</p>
                    </div>
                  }
                  onClick={() => {
                    deleteSelectedTestCases();
                  }}
                  className='w-[115px]'
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
              label={
                <div className='flex items-center gap-[8px]'>
                  <Image
                    className='w-[20px] h-[20px]'
                    src={WhitePlus}
                    alt='create_project'
                  />
                  <p className='text-white font-normal'>Create Folder</p>
                </div>
              }
            />

            <Button
              onClick={() => {
                openCreateTestCase();
              }}
              className='min-w-fit'
              label={
                <div className='flex items-center gap-[8px]'>
                  <Image
                    className='w-[20px] h-[20px]'
                    src={WhitePlus}
                    alt='create_project'
                  />
                  <p className='text-white font-normal'>Create test case</p>
                </div>
              }
            />
          </div>
        </div>
      </div>

      <div className='w-full pl-[20px] pr-[30px] max-w-full overflow-auto'>
        {projectFolders
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
