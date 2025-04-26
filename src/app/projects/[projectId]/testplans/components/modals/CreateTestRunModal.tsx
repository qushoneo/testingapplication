import Modal from '@/components/Modal';
import { useModalStore } from '@/stores/useModalStore';

export default function CreateTestRunModal() {
  const { isCreateTestRunOpen, closeCreateTestRun } = useModalStore();

  return (
    <Modal
      isOpen={isCreateTestRunOpen}
      setIsOpen={closeCreateTestRun}
      title='Create Test Run'
      onSubmit={() => {}}
      onCancel={closeCreateTestRun}
    >
      <div>
        <p>Create Test Run</p>
      </div>
    </Modal>
  );
}
