'use client';

import { useSelectedProjectStore } from '../../app/projects/[projectId]/store/useSelectedProjectStore';
import Folder from './Folder';

const FolderTree = () => {
  const { projectFolders } = useSelectedProjectStore();

  return (
    <div className='w-full flex flex-col gap-[4px]'>
      {projectFolders
        .filter((folder) => folder.parentId === null)
        .map((folder) => (
          <Folder key={folder.id} folder={folder} />
        ))}
    </div>
  );
};

export default FolderTree;
