'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import UsersTable from './UsersTable';
import { useUsersStore } from '@/stores/useUsersStore';

const UsersPage = () => {
  const users = useUsersStore((state) => state.users);

  const fields = [
    { name: 'User name', width: 'w-[15%] min-w-[230px]' },
    { name: 'Email', width: 'w-[15%] min-w-[210px]' },
    { name: 'Role', width: 'w-[10%] flex-1' },
  ];

  return (
    <ProtectedRoute>
      <div className="w-full h-full relative">
        <div className="flex gap-[8px] items-center sticky w-full top-[0px] pt-[20px] pl-[30px] bg-white z-10">
          <p className="text-2xl font-medium text-textPrimary">Users</p>
          <div>
            <p className="p-[4px] text-xs text-textPrimary rounded-[4px] h-[24px] border border-gray min-w-[24px] text-center">
              {users.length}
            </p>
          </div>
        </div>
        <div className="z-10 sticky pt-[20px] pl-[30px] bg-white">
          <div className="bg-lightgray h-[30px] w-full rounded-[4px] pr-[24px] pl-[32px] flex items-center gap-[12px] ">
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
        <UsersTable />
      </div>
    </ProtectedRoute>
  );
};
export default UsersPage;
