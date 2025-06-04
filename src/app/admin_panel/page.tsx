import Image from 'next/image';

async function getBugs() {
  let baseUrl = process.env.API_URL || 'http://localhost:3000';

  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    baseUrl = `http://${baseUrl}`;
  }

  try {
    const res = await fetch(`${baseUrl}/api/bug`, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error('Failed to fetch bugs');
    }

    return res.json();
  } catch (err) {
    console.error('Error fetching bugs:', err);
    return [];
  }
}

export default async function AdminPanel() {
  const bugs = await getBugs();

  console.log(bugs);

  return (
    <div className='flex flex-col gap-4 w-full p-4 overflow-y-auto h-screen'>
      {bugs?.map((bug: any) => (
        <div
          key={bug.id}
          className='flex gap-4 w-full border-b border-gray-200 pb-4 border-dashed items-center'
        >
          <p>{bug.text}</p>
          <Image src={bug.screenshot} alt={bug.text} width={500} height={300} />
        </div>
      ))}
    </div>
  );
}
