import Image from 'next/image';

async function getBugs() {
  const baseUrl = process.env.API_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/bug`, { cache: 'no-store' });

  if (!res.ok) {
    throw new Error('Failed to fetch bugs');
  }

  return res.json();
}

export default async function AdminPanel() {
  const bugs = await getBugs();

  return (
    <div className='flex flex-col gap-4 w-full p-4'>
      {bugs?.map((bug: any) => (
        <div
          key={bug.id}
          className='flex gap-4 w-full border-b border-gray-200 pb-4 border-dashed items-center'
        >
          <p>{bug.text}</p>
          <Image
            src={bug.screenshot}
            alt={bug.text}
            width={500}
            height={300}
            className='w-1/2 h-1/2'
          />
        </div>
      ))}
    </div>
  );
}
