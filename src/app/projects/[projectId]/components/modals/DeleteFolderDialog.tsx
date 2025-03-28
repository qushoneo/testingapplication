import Modal from '@/components/Modal';
import { useProjectStorageStore } from '@/stores/useProjectStorageStore';
import folderRequests from '@/app/requests/folders';
import { useModalStore } from '@/stores/useModalStore';
import { Folder } from '@prisma/client';
import { useFetch } from '@/app/hooks/useFetch';

export default function DeleteFolderDialog() {
  const { selectedProject } = useProjectStorageStore();
  const { isDeleteFolderOpen, closeDeleteFolder, selectedFolderId } =
    useModalStore();

  const { data: folders } = useFetch(`projects/${selectedProject?.id}/folders`);

  const deletingFolder = folders?.find(
    (folder: Folder) => folder.id === selectedFolderId
  );

  const onSubmit = () => {
    if (selectedProject && selectedFolderId) {
      folderRequests.deleteFolder(selectedProject.id, selectedFolderId);
    }
  };

  if (!isDeleteFolderOpen) return null;

  return (
    <Modal
      isOpen={isDeleteFolderOpen}
      setIsOpen={closeDeleteFolder}
      cancelText='Delete folder'
      submitText='Cancel'
      panelClassname='w-[400px] h-[250px]'
      title='Delete folder'
      onSubmit={closeDeleteFolder}
      onCancel={() => {
        onSubmit();
      }}
      type='delete'
    >
      <div className='mt-[24px] flex whitespace-nowrap flex-wrap justify-center'>
        <p>Are you sure you want delete</p>
        <p className='font-medium mx-[4px]'>{deletingFolder?.name}</p>
        <p className='text-[16px]'> folder?</p>
      </div>
    </Modal>
  );
}
