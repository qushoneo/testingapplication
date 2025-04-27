import Input from '@/components/Input';
import Modal from '@/components/Modal';
import { useState } from 'react';
import folderRequests from '@/app/requests/folders';
import { Folder } from '@prisma/client';
import { Select } from '@/components/Select';
import { useModalStore } from '@/stores/useModalStore';
import { useProjectStorageStore } from '@/stores/useProjectStorageStore';
import { useFetch } from '@/app/hooks/useFetch';
import { Error } from '@/types/Error';
import { AxiosError } from 'axios';

type SelectedFolder = {
  id: number | null;
  name: string;
  parentId?: number | null;
};

export default function EditFolderModal() {
  const { selectedProject } = useProjectStorageStore();

  const { data: folders } = useFetch(`projects/${selectedProject?.id}/folders`);

  const { isEditFolderOpen, closeEditFolder, selectedFolderId } =
    useModalStore();

  const editingFolder = folders?.find(
    (folder: Folder) => folder.id === selectedFolderId
  );

  const [folderName, setFolderName] = useState<string>(editingFolder?.name);
  const [errors, setErrors] = useState<{ field: string; message: string }[]>(
    []
  );
  const [parentFolder, setParentFolder] = useState<SelectedFolder | null>(
    folders?.find((folder: Folder) => folder.id === editingFolder?.parentId) ||
      null
  );

  const getAllChildFolders = (
    parentId: number,
    folders: Folder[]
  ): Folder[] => {
    const children = folders.filter(
      (folder: Folder) => folder.parentId === parentId
    );

    return children.concat(
      children.flatMap((child) => getAllChildFolders(child.id, folders))
    );
  };

  const filteredFolders = folders.filter((folder: Folder) => {
    if (!editingFolder) {
      return false;
    }

    const childFolders = getAllChildFolders(editingFolder.id, folders);
    const childFolderIds = childFolders.map((folder: Folder) => folder.id);

    return (
      !childFolderIds.includes(folder.id) && folder.id !== editingFolder?.id
    );
  });

  const resetDialogData = () => {
    setFolderName('');
    setErrors([]);
    setParentFolder(null);
    closeEditFolder();
  };

  const onSubmit = () => {
    setErrors([]);

    if (!selectedProject || !editingFolder) {
      return;
    }

    if (folderName.length < 4) {
      setErrors([{ field: 'name', message: 'at least 4 symbols required' }]);
    } else {
      folderRequests
        .updateFolder(
          selectedProject?.id,
          folderName,
          parentFolder?.id || null,
          editingFolder.id
        )
        .then((response) => {
          resetDialogData();
        })
        .catch((e: AxiosError) => setErrors(e.response?.data as Error[]));
    }
  };

  if (!isEditFolderOpen) return null;

  return (
    <Modal
      isOpen={isEditFolderOpen}
      setIsOpen={closeEditFolder}
      cancelText='Cancel'
      submitText='Update folder'
      panelClassname='w-[400px] h-[390px]'
      title='Update folder'
      onSubmit={onSubmit}
      onCancel={() => {
        resetDialogData();
        setErrors([]);
      }}
    >
      <div className='mt-[24px]'>
        <Input
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          minLength={3}
          label='Folder name'
          errors={errors}
          fieldName='name'
        />
      </div>

      <div className='mt-[24px]'>
        <Select
          value={parentFolder}
          options={[
            { id: null, name: `${selectedProject?.name} Project` || '' },
            ...filteredFolders,
          ]}
          setValue={setParentFolder}
          label='Parent folder'
        />
      </div>
    </Modal>
  );
}
