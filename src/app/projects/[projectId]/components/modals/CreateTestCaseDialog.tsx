import Input from '@/components/Input';
import Modal from '@/components/Modal';
import { useState } from 'react';

import { Select } from '@/components/Select';
import { useModalStore } from '@/stores/useModalStore';
import { severities } from '@/app/lib/severities';
import { SeverityColor } from '@/components/SeverityColor';
import testCasesRequest from '@/app/requests/testCases';
import TextArea from '@/components/TextArea';
import { Folder } from '@prisma/client';
import { useProjectStorageStore } from '@/stores/useProjectStorageStore';
import { useFetch } from '@/app/hooks/useFetch';

type SelectedSeverity = {
  id: string | null;
  name: string;
};

export default function CreateTestCaseDialog() {
  const { selectedProject } = useProjectStorageStore();

  const { data: folders } = useFetch(`projects/${selectedProject?.id}/folders`);

  const [testCaseName, setTestCaseName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<{ field: string; message: string }[]>(
    []
  );
  const [selectedSeverity, setSelectedSeverity] =
    useState<SelectedSeverity | null>(severities[0] || null);

  const { isCreateTestCaseOpen, closeCreateTestCase, selectedFolderId } =
    useModalStore();

  const [parentFolder, setParentFolder] = useState<Folder | null>(
    folders?.find((folder: Folder) => folder.id === selectedFolderId) || null
  );

  const severityIcons = [
    { id: null, icon: <SeverityColor value={null} /> },
    { id: 'LOW', icon: <SeverityColor value='LOW' /> },
    { id: 'MEDIUM', icon: <SeverityColor value='MEDIUM' /> },
    { id: 'HIGH', icon: <SeverityColor value='HIGH' /> },
  ];

  if (!isCreateTestCaseOpen) return null;

  const resetDialogData = () => {
    setTestCaseName('');
    setDescription('');
    setErrors([]);
    closeCreateTestCase();
  };

  const onSubmit = () => {
    setErrors([]);

    if (!selectedProject || !parentFolder) {
      return;
    }

    if (testCaseName.length < 3) {
      setErrors([
        { field: 'testcase_name', message: 'at least 4 symbols required' },
      ]);
    } else {
      testCasesRequest
        .createTestCase(
          parentFolder.id,
          selectedProject.id,
          testCaseName,
          description,
          selectedSeverity?.id || null
        )
        .then((response) => {
          resetDialogData();
        });
    }
  };

  return (
    <Modal
      isOpen={isCreateTestCaseOpen}
      setIsOpen={closeCreateTestCase}
      cancelText='Cancel'
      submitText='Create test case'
      panelClassname='w-[400px] h-[499px]'
      title='Create test case'
      onSubmit={onSubmit}
      onCancel={() => {
        resetDialogData();
        setErrors([]);
      }}
    >
      <div className='mt-[24px]'>
        <Input
          value={testCaseName}
          onChange={(e) => setTestCaseName(e.target.value)}
          minLength={3}
          label='Test case name'
          hasError={!!errors.find((error) => error.field === 'testcase_name')}
          errorMessage={
            errors.find((error) => error.field === 'testcase_name')?.message
          }
        />
      </div>

      <div className='mt-[24px]'>
        <Select
          value={parentFolder}
          options={folders}
          setValue={setParentFolder}
          label='Parent folder'
        />
      </div>

      <div className='mt-[10px]'>
        <Select
          value={selectedSeverity}
          options={severities}
          setValue={setSelectedSeverity}
          label='Severity'
          showIconsByValue={true}
          icons={severityIcons}
        />
      </div>

      <div className='mt-[10px]'>
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label='Description'
        />
      </div>
    </Modal>
  );
}
