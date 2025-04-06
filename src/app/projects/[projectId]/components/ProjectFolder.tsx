'use client';

import Image from 'next/image';
import BlackPlus from '@/app/assets/black_plus.svg';
import Pencil from '@/app/assets/pencil.svg';
import Trash from '@/app/assets/trash.svg';
import { TestCase } from '@prisma/client';
import ProjectTestCase from './TestCase';
import Dropdown from '@/components/Dropdown';
import QuickCreationInput from '@/components/QuickCreationInput';
import testCasesRequest from '@/app/requests/testCases';
import Checkbox from '@/components/Checkbox';
import { useProjectStorageStore } from '@/stores/useProjectStorageStore';
import { useModalStore } from '@/stores/useModalStore';
import Loading from '@/components/Loading';
import useSelectedTestCasesStore from '@/stores/useTestCasesStore';
import { useFetch } from '@/app/hooks/useFetch';
import { Folder } from '@/types/Folder';

type ProjectFolderProps = {
  folder: Folder;
  mode?: 'select' | 'create' | 'show';
  search?: string;
  testCases?: TestCase[];
  disableChildrenFolders?: boolean;
};

export default function ProjectFolder({
  folder,
  mode = 'create',
  search,
  testCases,
  disableChildrenFolders = false,
}: ProjectFolderProps) {
  const { selectedProject } = useProjectStorageStore();

  const {
    openCreateFolder,
    openEditFolder,
    openDeleteFolder,
    openCreateTestCase,
  } = useModalStore();

  const {
    isTestCaseSelected,
    multipleSelectTestCase,
    multipleUnselectTestCase,
  } = useSelectedTestCasesStore();

  const { data: folders, isLoading: isFolderLoading } = useFetch(
    `projects/${selectedProject?.id}/folders`
  );

  const childrenFolders =
    folders?.filter(
      ({ parentId }: { parentId: number }) => parentId === folder.id
    ) || [];

  const { data: allProjectTestCases, isLoading: isTestCaseLoading } = useFetch(
    `projects/${selectedProject?.id}/test_cases`
  );

  const getTestCases = () => {
    if (testCases) {
      return testCases;
    }

    return allProjectTestCases;
  };

  if (isTestCaseLoading || isFolderLoading) {
    return <Loading />;
  }

  const childrenTestCases = getTestCases()?.filter(
    ({ folderId, name }: { folderId: number; name: string }) =>
      folderId === folder.id &&
      (search ? name.toLowerCase().includes(search.toLowerCase()) : true)
  );

  const isFolderTestCasesSelected = childrenTestCases.every(
    ({ id }: { id: number }) => isTestCaseSelected(id)
  );

  return (
    <div className={`flex flex-col relative`}>
      {mode === 'select' &&
        (childrenFolders.length > 0 || childrenTestCases.length > 0) && (
          <div className='border-l border-gray h-[calc(100%-53px)] w-[1px] absolute left-[18px] top-[48px]' />
        )}

      <div
        className={`flex-1 pl-[40px] pr-[40px] bg-lightgray rounded-[4px] mb-[12px] flex items-center relative group`}
      >
        {childrenTestCases.length > 0 &&
          ['select', 'create'].includes(mode) && (
            <Checkbox
              className={`absolute left-[8px] ${
                isFolderTestCasesSelected ? 'block' : 'hidden'
              } group-hover:block`}
              isActive={isFolderTestCasesSelected}
              onClick={() => {
                if (isFolderTestCasesSelected) {
                  multipleUnselectTestCase(
                    childrenTestCases.map(({ id }: { id: number }) => id)
                  );
                } else {
                  multipleSelectTestCase(childrenTestCases);
                }
              }}
            />
          )}

        <p className='text-[18px] font-medium'>{folder.name}</p>

        {mode === 'create' && (
          <div className='flex gap-[12px] ml-[12px]'>
            <>
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
            </>

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
        )}
      </div>

      <div
        className={`${
          disableChildrenFolders ? 'pl-[0px]' : 'pl-[36px]'
        } flex flex-col gap-[4px]`}
      >
        {childrenTestCases.length > 0 && (
          <>
            {childrenTestCases.map((testCase: TestCase) => (
              <ProjectTestCase
                key={testCase.id}
                testCase={testCase}
                mode={mode}
              />
            ))}
          </>
        )}

        <div className='ml-[30px] mb-[4px]'>
          {mode === 'create' && (
            <QuickCreationInput
              placeholder='Create quick test case'
              // className='ml-[36px] mb-[4px]'
              errorClassName='ml-[28px]'
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
          )}
        </div>

        {!disableChildrenFolders &&
          [...childrenFolders]
            .sort(
              (a: Folder, b: Folder) => a.children.length - b.children.length
            )
            .map((childFolder: Folder) => (
              <ProjectFolder
                key={childFolder.id}
                folder={childFolder}
                mode={mode}
                search={search}
                testCases={testCases}
                disableChildrenFolders={disableChildrenFolders}
              />
            ))}
      </div>
    </div>
  );
}
