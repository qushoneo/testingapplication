import { useState } from 'react';
import Modal from './Modal';
import { Textarea } from '@headlessui/react';
import Image from 'next/image';
import axios from 'axios';

export default function BugDialog({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [bugText, setBugText] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const sendBug = async () => {
    const response = await axios.post(
      '/api/bug',
      {
        bugText,
        screenshot,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      setIsOpen(false);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();

    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setScreenshot(event.target.result as string);
            }
          };
          reader.readAsDataURL(file);
          return;
        }
      }
    }
  };

  return (
    <Modal
      isOpen={true}
      setIsOpen={setIsOpen}
      title='Describe bug here....'
      onSubmit={() => {
        sendBug().then(() => {
          //   setIsOpen(false);
          //   setBugText('');
          //   setScreenshot(null);
        });
      }}
      submitText='Send'
      cancelText='Cancel'
      onCancel={() => {
        setIsOpen(false);
        setBugText('');
        setScreenshot(null);
      }}
    >
      <div
        onPaste={handlePaste}
        className='w-[400px] h-[400px] bg-white rounded-lg py-4'
      >
        <Textarea
          value={bugText}
          onChange={(e) => setBugText(e.target.value)}
          placeholder='Describe bug here....'
          className='w-full h-[120px] rounded-lg outline-none border-gray-200 border-2 px-4 py-2'
        />

        <p className='text-sm text-gray-500'>You can paste screenshot here</p>
        <div className='w-full h-[120px] bg-gray-200 rounded-lg p-4 relative'>
          {screenshot && (
            <>
              <Image
                src={screenshot}
                alt='screenshot'
                className='w-full h-full object-cover'
                width={100}
                height={100}
              />

              <div
                className='absolute top-0 right-0 w-[20px] h-[20px] bg-gray-200 rounded-full flex items-center justify-center'
                onClick={() => setScreenshot(null)}
              >
                <p className='text-gray-500'>X</p>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
