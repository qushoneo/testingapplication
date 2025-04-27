'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import UsersTable from './UsersTable';
import { useFetch } from '../hooks/useFetch';
import Loading from '@/components/Loading';
import Button from '@/components/Button';
import { useModalStore } from '@/stores/useModalStore';
import InviteUserModal from './modals/InviteUserModal';

const UsersPage = () => {
  const { data: users, isLoading } = useFetch('/users');
  const { isInviteUserOpen, openInviteUser, closeInviteUser } = useModalStore();

  const fields = [
    { name: 'User name', width: 'w-[15%] min-w-[230px]' },
    { name: 'Email', width: 'w-[15%] min-w-[210px]' },
    { name: 'Role', width: 'w-[10%] flex-1' },
  ];

  return (
    <ProtectedRoute>
      <div className='w-full h-full relative'>
        <div className='flex gap-[8px] items-center sticky w-full top-[0px] pt-[20px] px-[30px] bg-white z-10'>
          <p className='text-2xl font-medium text-textPrimary'>Users</p>
          <div>
            {users?.length && (
              <p className='p-[4px] text-xs text-textPrimary rounded-[4px] h-[24px] border border-gray min-w-[24px] text-center'>
                {users.length}
              </p>
            )}
          </div>

          <div className='flex ml-auto'>
            <Button
              label='Invite user'
              variant='filled'
              onClick={openInviteUser}
            />
          </div>
        </div>
        <div className='z-10 sticky pt-[20px] px-[30px] bg-white'>
          <div className='bg-lightgray h-[30px] w-full rounded-[4px] pr-[24px] pl-[32px] flex items-center gap-[12px] overflow-hidden '>
            {fields.map((field, i) => (
              <p
                key={i}
                className={`text-lg ${field.width} text-textPrimary font-medium`}
              >
                {field.name}
              </p>
            ))}
          </div>
        </div>
        {isLoading ? <Loading /> : <UsersTable />}
      </div>

      {isInviteUserOpen && <InviteUserModal />}
    </ProtectedRoute>
  );
};
export default UsersPage;
