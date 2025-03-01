import { useUsersStore } from '@/stores/useUsersStore';
import UserRow from './UserRow';

export default function UsersTable() {
  const users = useUsersStore((state) => state.users);

  return (
    <div className=" pt-[12px] pl-[30px] bg-white">
      {users.map((user) => (
        <UserRow key={user.id} user={user} />
      ))}
    </div>
  );
}
