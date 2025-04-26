'use client';

import React, { ReactNode, useEffect, useState, useRef } from 'react';
import Header from './Header';
import { useAuth } from '@/context/AuthProvider';
import Loading from './Loading';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children?: ReactNode;
  className?: string;
  leftSideBar?: ReactNode | null;
  containerClassName?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  leftSideBar = null,
  className = '',
  containerClassName = '',
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user === null) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user === null) {
      timeoutRef.current = setTimeout(() => {
        router.push('/login');
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [user, router]);

  if (loading) {
    return <Loading />;
  }

  if (user === null) {
    return (
      <div className='w-full h-full flex items-center justify-center flex-col gap-[10px]'>
        <h1 className='text-[24px] font-bold'>403 - Forbidden</h1>
        <p className='text-[16px]'>
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className='bg-secondaryBackground w-full h-full flex flex-col'>
      <Header haveSideBar={!!leftSideBar} />

      <div
        className={`flex-1 flex overflow-hidden mr-[15px] pr-[15px] h-[calc(100%-75px)] max-h-[calc(100%-75px)]  ${containerClassName} ${
          leftSideBar ? '' : 'ml-[30px]'
        }`}
      >
        {leftSideBar}
        <div
          className={`flex-1 bg-white rounded-[7px] h-full h-fit flex overflow-y-auto ${className}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
