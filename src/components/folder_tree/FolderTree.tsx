'use client';

import { useFoldersStore } from '@/stores/useFoldersStore';
import Folder from './Folder';

const FolderTree = () => {
  const { folders } = useFoldersStore();

  return (
    <div className='w-full flex flex-col gap-[4px]'>
      {folders
        .filter((folder) => folder.parentId === null)
        .map((folder) => (
          <Folder key={folder.id} folder={folder} />
        ))}
    </div>
  );
};

export default FolderTree;
