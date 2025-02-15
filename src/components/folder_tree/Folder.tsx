import { Folder } from '@prisma/client';
import Image from 'next/image';
import { useState } from 'react';
import Minus from '@/app/assets/black_minus.svg';
import Plus from '@/app/assets/black_plus.svg';
import { useFoldersStore } from '@/stores/useFoldersStore';
import TestCase from './TestCase';
import { useTestCasesStore } from '@/stores/useTestCasesStore';

interface FolderProps {
  folder: Folder;
}

export default function TreeFolder({ folder }: FolderProps) {
  const { testCases } = useTestCasesStore();

  const { openedFolderId, setOpenedFolderId } = useFoldersStore();

  const { folders } = useFoldersStore();

  const [open, setOpen] = useState<boolean>(openedFolderId === folder.id);

  const childrenFolders = folders.filter(
    (childrenFolder) => childrenFolder.parentId === folder.id
  );

  const childrenTestCases = testCases.filter(
    (childrenTestCase) => childrenTestCase.folderId === folder.id
  );

  const isFolderOpen = folder.parentId ? open : openedFolderId === folder.id;

  return (
    <div className={`w-full ${folder.parentId ? 'border-l' : ''} border-gray`}>
      <div
        className='flex items-center gap-[4px] cursor-pointer pl-[10px] py-[2px] h-[22px]'
        onClick={() => {
          folder.parentId
            ? setOpen(!open)
            : openedFolderId === null
            ? setOpenedFolderId(folder.id)
            : setOpenedFolderId(null);
        }}
      >
        <div className='border border-gray rounded-[4px] w-[16px] h-[16px]'>
          <Image src={isFolderOpen ? Minus : Plus} alt='minus' />
        </div>
        <p className='text-left text-[14px]'>{folder.name}</p>
        {childrenFolders.length > 0 && (
          <p className='border border-gray rounded-[4px] min-w-[16px] h-[16px] text-[12px] flex items-center justify-center ml-auto'>
            {childrenFolders.length}
          </p>
        )}
      </div>
      {isFolderOpen && (
        <>
          <div className='ml-[18px] flex flex-col'>
            {childrenFolders.map((childrenFolder) => (
              <TreeFolder key={childrenFolder.id} folder={childrenFolder} />
            ))}
          </div>
          <div className='ml-[18px] flex flex-col border-l border-gray'>
            {childrenTestCases.map((childrenTestCase) => (
              <TestCase key={childrenTestCase.id} testCase={childrenTestCase} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
