'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import Header from './Header';
import { useAuth } from '@/context/AuthProvider';
import Loading from './Loading';

interface ProtectedRouteProps {
  children?: ReactNode;
  className?: string;
  leftSideBar?: ReactNode | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  leftSideBar = null,
  className,
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
        className={`flex-1 flex overflow-auto  mr-[15px] pr-[15px] mb-[15px] h-fit overflow-hidden ${
          leftSideBar ? '' : 'ml-[30px]'
        }`}
      >
        {leftSideBar}
        <div
          className={`flex-1 bg-white rounded-[7px] mb-[15px] min-h-[calc(100%-15px)] h-fit flex ${className}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
