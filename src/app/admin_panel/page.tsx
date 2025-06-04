import axios from 'axios';
import Image from 'next/image';

export default async function AdminPanel() {
  const { data: bugs } = await axios.get('http://localhost:3000/api/bug');

  return (
    <div className='flex flex-col gap-4 w-full p-4  '>
      {bugs?.map((bug: any) => (
        <div
          key={bug.id}
          className='flex gap-4 w-full border-b border-gray-200 pb-4 border-dashed items-center'
        >
          <p>{bug.text}</p>
          <Image src={bug.screenshot} alt={bug.text} className='w-1/2 h-1/2' />
        </div>
      ))}
    </div>
  );
}
