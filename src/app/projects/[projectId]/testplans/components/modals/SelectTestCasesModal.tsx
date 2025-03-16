import Modal from '@/components/Modal';
import useCreateTestPlanStore from '@/stores/useCreateTestPlanStore';
import { useModalStore } from '@/stores/useModalStore';
import Arrow from '@/app/assets/arrow_down.svg';
import Image from 'next/image';
import Cross from '@/app/assets/black_cross.svg';
import Input from '@/components/Input';
import Search from '@/app/assets/search.svg';
import { Suspense, useDeferredValue, useEffect, useState } from 'react';
import FolderTree from '@/components/folder_tree/FolderTree';
import { useFoldersStore } from '@/stores/useFoldersStore';
import ProjectFolder from '../../../components/ProjectFolder';
import { useTestCasesStore } from '@/stores/useTestCasesStore';

export default function SelectTestCasesModal() {
  const { closeSelectTestCases } = useModalStore();
  const [search, setSearch] = useState('');

  const { testCases } = useTestCasesStore();

  console.log(testCases);
  const { folders } = useFoldersStore();

  const searchVal = useDeferredValue(search);

  useEffect(() => {
    console.log(searchVal);
  }, [searchVal]);

  return (
    <Modal
      isOpen={true}
      setIsOpen={closeSelectTestCases}
      hideTitle
      panelClassname='w-full mx-[45px] h-[calc(100%-60px)] flex flex-col gap-[12px]'
      cancelText='Cancel'
      submitText='Done'
    >
      <div className='w-[full] h-[30px] flex items-center justify-between'>
        <div className='flex items-center gap-[8px]'>
          <Image
            src={Arrow}
            alt='close'
            width={24}
            height={24}
            onClick={closeSelectTestCases}
            className='transform rotate-90'
          />
          <p className='font-medium text-[24px]'>Select test cases</p>
        </div>

        <Image
          src={Cross}
          alt='close'
          width={24}
          height={24}
          onClick={closeSelectTestCases}
        />
      </div>

      <div>
        <Input
          placeholder='Search'
          placeholderIcon={Search}
          className='w-[273px]'
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
      </div>

      <div className='w-full h-full flex border border-gray rounded-[8px] overflow-hidden'>
        <div className='min-w-[273px] max-w-[273px] h-full border-r border-gray px-[30px] py-[20px]'>
          <FolderTree />
        </div>

        <div className='w-full h-full overflow-auto px-[30px] py-[20px]'>
          {folders.map((folder) => (
            <ProjectFolder key={folder.id} folder={folder} />
          ))}
        </div>
      </div>
    </Modal>
  );
}
