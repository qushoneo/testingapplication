'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Custom404() {
  const router = useRouter();
  const [timer, setTimer] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    if (timer === 1) {
      router.push('/login');
    }
    return () => clearInterval(interval);
  }, [timer, router]);

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='font-Montserrat text-3xl font-bold text-textPrimary'>
        404 - Page Not Found
      </h1>
      {timer > 0 && (
        <p className='font-Montserrat text-xl text-textPrimary'>
          Redirect in {timer} seconds
        </p>
      )}
    </div>
  );
}
