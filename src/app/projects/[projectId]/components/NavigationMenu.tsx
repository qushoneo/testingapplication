import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavigationMenuProps = {
  projectId: number;
};

export default function NavigationMenu({ projectId }: NavigationMenuProps) {
  const pathname = usePathname();
  const menuGroups = [
    [{ name: 'Storage', url: `/projects/${projectId}/storage` }],
    [
      { name: 'Test plans', url: `/projects/${projectId}/testplans` },
      { name: 'Test runs', url: `/projects/${projectId}/test_runs` },
      { name: 'Environments', url: `/projects/${projectId}/environments` },
    ],
    [{ name: 'Defects', url: `/projects/${projectId}/defects` }],
  ];

  return (
    <div className='min-w-[140px] max-w-[140px] h-full flex flex-col py-[40px] px-[4px] fixed bg-gray z-10'>
      {menuGroups.map((group, i) => {
        return (
          <div key={'group-' + i} className='mt-[32px]'>
            {group.map((link) => {
              const isActive = pathname === link.url;

              return (
                <Link key={link.url} href={link.url}>
                  <p
                    className={`${
                      isActive ? 'bg-white' : 'bg-gray'
                    } w-full px-[12px] py-[8px] rounded-[4px] text-sm`}
                  >
                    {link.name}
                  </p>
                </Link>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
