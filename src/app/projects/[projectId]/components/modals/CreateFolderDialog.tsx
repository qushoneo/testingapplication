import Input from '@/components/Input';
import Modal from '@/components/Modal';
import { useEffect, useState } from 'react';
import { useProjectStorageStore } from '@/stores/useProjectStorageStore';
import folderRequests from '@/app/requests/folders';
import { Select } from '@/components/Select';
import { useModalStore } from '@/stores/useModalStore';
import { Folder } from '@prisma/client';
import { useFetch } from '@/app/hooks/useFetch';

type SelectedFolder = {
  id: number | null;
  name: string;
  parentId?: number | null;
};

export default function CreateFolderDialog() {
  const { selectedProject } = useProjectStorageStore();
  const { isCreateFolderOpen, closeCreateFolder, selectedFolderId } =
    useModalStore();

  const [folderName, setFolderName] = useState<string>('');
  const [errors, setErrors] = useState<{ field: string; message: string }[]>(
    []
  );
  const [parentFolder, setParentFolder] = useState<SelectedFolder | null>(null);

  const { data: folders } = useFetch(`projects/${selectedProject?.id}/folders`);

  useEffect(() => {
    if (selectedFolderId && isCreateFolderOpen) {
      setParentFolder(
        folders?.find((folder: Folder) => selectedFolderId === folder.id) ||
          null
      );
    }
  }, [isCreateFolderOpen]);

  const resetDialogData = () => {
    setFolderName('');
    setErrors([]);
    setParentFolder(null);
    closeCreateFolder();
  };

  const onSubmit = () => {
    setErrors([]);

    if (!selectedProject) {
      return;
    }

    if (folderName.length < 4) {
      setErrors([{ field: 'name', message: 'at least 4 symbols required' }]);
    } else {
      folderRequests
        .createFolder(selectedProject?.id, folderName, parentFolder?.id || null)
        .then(() => {
          resetDialogData();
        })
        .catch((e) => setErrors(e.response.data));
    }
  };

  if (!isCreateFolderOpen) return null;

  return (
    <Modal
      isOpen={isCreateFolderOpen}
      setIsOpen={closeCreateFolder}
      cancelText='Cancel'
      submitText='Create folder'
      panelClassname='w-[400px] h-[390px]'
      title='Create folder'
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
            ...folders,
          ]}
          setValue={setParentFolder}
          label='Parent folder'
        />
      </div>
    </Modal>
  );
}
