'use client';

import Folder from './Folder';
import { Folder as FolderType, TestCase as TestCaseType } from '@prisma/client';

type FolderTreeProps = {
  folders: FolderType[];
  testCases: TestCaseType[];
};

const FolderTree = ({ folders, testCases }: FolderTreeProps) => {
  return (
    <div className='w-full flex flex-col gap-[4px]'>
      {folders
        .filter((folder: FolderType) => folder.parentId === null)
        .map((folder: FolderType) => (
          <Folder
            key={folder.id}
            folder={folder}
            folders={folders}
            testCases={testCases}
          />
        ))}
    </div>
  );
};

export default FolderTree;
