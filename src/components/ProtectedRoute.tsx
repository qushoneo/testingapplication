'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import Header from './Header';
import { useAuth } from '@/context/AuthProvider';
import Loading from './Loading';

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

  useEffect(() => {
    if (user === null) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  if (user === null) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <h1>403 - Forbidden</h1>
        <p>You do not have permission to access this page.</p>
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
