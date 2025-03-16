'use client';

import Image from 'next/image';
import BlackPlus from '@/app/assets/black_plus.svg';
import Pencil from '@/app/assets/pencil.svg';
import Trash from '@/app/assets/trash.svg';
import { Folder, TestCase } from '@prisma/client';
import ProjectTestCase from './TestCase';
import Dropdown from '@/components/Dropdown';
import QuickCreationInput from '@/components/QuickCreationInput';
import testCasesRequest from '@/app/requests/testCases';
import Checkbox from '@/components/Checkbox';
import { useFoldersStore } from '@/stores/useFoldersStore';
import { useTestCasesStore } from '@/stores/useTestCasesStore';
import { useProjectStorageStore } from '@/stores/useProjectStorageStore';
import { useModalStore } from '@/stores/useModalStore';
import useSWR from 'swr';
import { fetcher } from '@/app/lib/fetcher';
import Loading from '@/components/Loading';

type ProjectFolderProps = {
  folder: Folder;
};

export default function ProjectFolder({ folder }: ProjectFolderProps) {
  const { selectedProject } = useProjectStorageStore();
  const {
    openCreateFolder,
    openEditFolder,
    openDeleteFolder,
    openCreateTestCase,
  } = useModalStore();

  const { addTestCase, isTestCaseSelected, selectFolderTestCases } =
    useTestCasesStore();

  const { data: folders, isLoading: isFolderLoading } = useSWR(
    `/api/projects/${selectedProject?.id}/folders`,
    fetcher
  );

  const childrenFolders = folders.filter(
    ({ parentId }: { parentId: number }) => parentId === folder.id
  );

  const { data: testCases, isLoading: isTestCaseLoading } = useSWR(
    `/api/projects/${selectedProject?.id}/test_cases`,
    fetcher
  );

  if (isTestCaseLoading || isFolderLoading) {
    return <Loading />;
  }

  const childrenTestCases = testCases?.filter(
    ({ folderId }: { folderId: number }) => folderId === folder.id
  );

  const isFolderTestCasesSelected = testCases
    .filter(({ folderId }: { folderId: number }) => folderId === folder.id)
    .every(({ id }: { id: number }) => isTestCaseSelected(id));

  return (
    <div className='flex flex-col'>
      <div
        className={`flex-1 py-[8px] pl-[40px] pr-[40px] bg-lightgray rounded-[4px] mb-[12px] flex items-center relative group`}
      >
        {childrenTestCases.length > 0 && (
          <Checkbox
            className={`absolute left-[8px] ${
              isFolderTestCasesSelected ? 'block' : 'hidden'
            } group-hover:block`}
            isActive={isFolderTestCasesSelected}
            onClick={() => selectFolderTestCases(folder.id)}
          />
        )}

        <p className='text-[18px] font-medium'>{folder.name}</p>

        <div className='flex gap-[12px] ml-[12px]'>
          <Dropdown
            options={[
              {
                label: 'Create folder',
                onClick: () => openCreateFolder(folder.id || null),
              },

              {
                label: 'Create test case',
                onClick: () => openCreateTestCase(folder.id || null),
              },
            ]}
          >
            <Image
              className='rounded-[4px] border border-[gray] w-[16px] h-[16px] cursor-pointer'
              alt='add'
              src={BlackPlus}
            />
          </Dropdown>

          <Image
            className='rounded-[4px] border border-[gray] w-[16px] h-[16px] cursor-pointer'
            alt='edit'
            src={Pencil}
            onClick={() => openEditFolder(folder.id)}
          />

          <Image
            className='rounded-[4px] border border-[gray] w-[16px] h-[16px] cursor-pointer'
            alt='delete'
            src={Trash}
            onClick={() => openDeleteFolder(folder.id)}
          />
        </div>
      </div>

      <div className='pl-[36px] flex flex-col'>
        {childrenTestCases.length > 0 && (
          <div className='flex flex-col gap-[4px]'>
            {childrenTestCases.map((testCase: TestCase) => (
              <ProjectTestCase key={testCase.id} testCase={testCase} />
            ))}
          </div>
        )}

        <QuickCreationInput
          placeholder='Create quick test case'
          className='ml-[36px] mb-[4px]'
          errorClassName='ml-[36px]'
          onFinish={async (value) => {
            if (selectedProject) {
              await testCasesRequest.createTestCase(
                folder.id,
                selectedProject?.id,
                value,
                '',
                null
              );
            }
          }}
        />

        {childrenFolders.map((childFolder: Folder) => (
          <ProjectFolder key={childFolder.id} folder={childFolder} />
        ))}
      </div>
    </div>
  );
}
