import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserAvatar from './UserAvatar';

import Button from './Button';
import { useAuth } from '@/context/AuthProvider';

type HeaderProps = {
  haveSideBar?: boolean;
};

export default function Header({ haveSideBar }: HeaderProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const routes = [
    { name: 'Projects', url: '/projects' },
    {
      name: 'Users',
      url: '/users',
    },
    {
      name: 'Integrations',
      url: '/integrations',
    },
  ];

  return (
    <header
      className={`h-[60px] ${
        haveSideBar ? 'pl-[140px] pr-[60px]' : 'px-[60px]'
      } py-[12px] flex justify-between`}
    >
      <div className='flex gap-[4px]'>
        {routes.map((route, i) => {
          const isActive = pathname === route.url;
          return (
            <Link
              className={`${
                isActive ? 'bg-white rounded-[4px]' : 'bg-gray'
              } px-[12px] py-[8px] h-[34px]`}
              key={i}
              href={route.url}
            >
              <p className='text-textPrimary text-sm'>{route.name}</p>
            </Link>
          );
        })}
      </div>

      {user && (
        <div className='flex'>
          <div className='flex items-center gap-[10px] text-capitalize'>
            <UserAvatar user={user} />
            <p className='text-[14px] capitalize whitespace-nowrap'>
              {user.name}
            </p>
          </div>{' '}
          <Button className='w-[100px]' label='log out' onClick={logout} />
        </div>
      )}
    </header>
  );
}
