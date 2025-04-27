import { useFetch } from '../hooks/useFetch';
import UserRow from './UserRow';

export default function UsersTable() {
  const { data: users, isLoading } = useFetch('/users');

  return (
    <div className=' pt-[12px] px-[30px] bg-white overflow-hidden'>
      {users?.map((user) => (
        <UserRow key={user.id} user={user} />
      ))}
    </div>
  );
}
