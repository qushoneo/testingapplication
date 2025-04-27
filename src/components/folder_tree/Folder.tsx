import { Folder } from '@prisma/client';
import Image from 'next/image';
import { useState } from 'react';
import Minus from '@/app/assets/black_minus.svg';
import Plus from '@/app/assets/black_plus.svg';
import { useFoldersStore } from '@/stores/useFoldersStore';
import TestCase from './TestCase';
import { Folder as FolderType, TestCase as TestCaseType } from '@prisma/client';

interface FolderProps {
  folder: FolderType;
  folders: FolderType[];
  testCases: TestCaseType[];
}

export default function TreeFolder({
  folder,
  folders,
  testCases,
}: FolderProps) {
  const { openedFolderId, setOpenedFolderId } = useFoldersStore();
  const [open, setOpen] = useState<boolean>(openedFolderId === folder.id);

  const childrenFolders = folders.filter(
    (childrenFolder: FolderType) => childrenFolder.parentId === folder.id
  );

  const childrenTestCases = testCases.filter(
    (childrenTestCase: TestCaseType) => childrenTestCase.folderId === folder.id
  );

  const isFolderOpen = folder.parentId ? open : openedFolderId === folder.id;

  const isMainFolder = folder.parentId === null;

  return (
    <div className={`w-full ${!isMainFolder ? 'border-l border-gray' : ''} `}>
      <div
        className={`flex items-center gap-[4px] cursor-pointer pl-[10px] ${
          isMainFolder ? 'mb-[4px]' : ''
        }`}
        onClick={() => {
          if (folder.parentId) {
            setOpen(!open);
          } else {
            if (openedFolderId === null) {
              setOpenedFolderId(folder.id);
            } else {
              setOpenedFolderId(null);
            }
          }
        }}
      >
        <div
          className={`flex items-center gap-[4px] w-full h-[26px] px-[4px]  ${
            isMainFolder && isFolderOpen ? 'bg-lightgray rounded-[4px]' : ''
          }`}
        >
          <div className='border border-gray rounded-[4px] w-[16px] h-[16px] '>
            <Image src={isFolderOpen ? Minus : Plus} alt='minus' />
          </div>
          <p className='text-left text-[14px]'>{folder.name}</p>
          {childrenFolders.length > 0 && (
            <p className='border border-gray rounded-[4px] min-w-[16px] h-[16px] text-[12px] flex items-center justify-center ml-auto'>
              {childrenFolders.length}
            </p>
          )}
        </div>
      </div>
      {isFolderOpen && (
        <>
          <div className='ml-[18px] flex flex-col'>
            {childrenFolders.map((childrenFolder: FolderType) => (
              <TreeFolder
                key={childrenFolder.id}
                folder={childrenFolder}
                folders={folders}
                testCases={testCases}
              />
            ))}
          </div>
          <div className='ml-[18px] flex flex-col border-l border-gray'>
            {childrenTestCases.map((childrenTestCase: TestCaseType) => (
              <TestCase key={childrenTestCase.id} testCase={childrenTestCase} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
