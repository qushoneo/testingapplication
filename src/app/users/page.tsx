'use client';

import Button from '../../components/Button';
import Input from '../../components/Input';
import { Select } from '../../components/Select';
import { JobTitle } from '../../types/JobTitle';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthProvider';
import { jobTitles } from '../lib/jobTitles';
import ProtectedRoute from '@/components/ProtectedRoute';
import { User } from '@prisma/client';
import userRequests from '../requests/users';

const Signup = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    userRequests.getAllUsers().then((response) => {
      setUsers(response.data);
    });
  }, []);

  return (
    <ProtectedRoute>
      <div className='w-[100%] h-[100%]'>
        {users.map((user) => {
          return <div className='w-full h-[60px]'>{user.name}</div>;
        })}
      </div>
    </ProtectedRoute>
  );
};

export default Signup;
