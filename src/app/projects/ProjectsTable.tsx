import Link from 'next/link';
import { useProjectsStore } from '../../stores/useProjectsStore';
import Checkbox from '@/components/Checkbox';
import { useRouter } from 'next/navigation';
import { useFetch } from '@/app/hooks/useFetch';
import { Project } from '@prisma/client';

export default function ProjectsTable() {
  const { data: projects } = useFetch('projects');

  const { selectProject, unselectProject, selectedProjects } =
    useProjectsStore();

  const router = useRouter();

  const moveToProjectStorage = (projectId: number) => {
    router.push(`/projects/${projectId}/storage`);
  };

  const projecsTableFields = [
    { name: 'name', width: 'w-[15%] min-w-[230px]' },
    { name: 'defects', width: 'w-[15%] min-w-[210px]' },
    { name: 'members', width: 'w-[70%] flex-1' },
  ];

  return (
    <div className='mt-[12px] flex flex-col gap-[4px] relative z-1'>
      {projects.map((project: Project) => {
        const isSelected = !!selectedProjects.find(
          (_project) => _project.id === project.id
        );

        return (
          <div
            key={project.id}
            className={`flex gap-[12px] px-[32px] py-[4px] ${
              isSelected ? 'bg-lightgray' : ''
            } group cursor-pointer`}
            onClick={() => {
              moveToProjectStorage(project.id);
            }}
          >
            <Checkbox
              isActive={isSelected}
              onClick={(e) => {
                e.stopPropagation();
                if (isSelected) {
                  unselectProject(project.id);
                } else {
                  selectProject(project);
                }
              }}
              className={`absolute left-[8px] ${
                isSelected ? 'block' : 'hidden'
              }  group-hover:block`}
            />

            {projecsTableFields.map((field, j) => {
              if (field.name === 'name')
                return (
                  <p
                    key={'col-' + j}
                    className={`text-sm text-textPrimary ${field.width}`}
                  >
                    {project.name}
                  </p>
                );

              if (field.name === 'defects') {
                // @ts-ignore
                return project?.defects?.length === 0 ? (
                  <p
                    key={'col-' + j}
                    className={`text-sm text-textPrimary ${field.width}`}
                  >
                    No defects were found
                  </p>
                ) : (
                  <Link
                    href='/defects'
                    className={`text-sm text-link underline ${field.width}`}
                    key={'col-' + j}
                  >
                    <p>Link to defects</p>
                  </Link>
                );
              }

              if (field.name === 'members') {
                const displayingMembers = 3;
                // @ts-ignore
                const remainingMembersCount =
                  // @ts-ignore
                  project?.members?.length - displayingMembers;

                return (
                  <div
                    key={'col' + j}
                    className={`${field.width} flex gap-[12px]`}
                  >
                    {/* @ts-ignore */}
                    {project?.members?.length > 0 &&
                      // @ts-ignore
                      project.members
                        .slice(0, displayingMembers)
                        // @ts-ignore
                        .map((member) => (
                          <p key={member.id} className='text-sm'>
                            {member.name}
                          </p>
                        ))}

                    {remainingMembersCount > 0 && (
                      <p className='text-[14px] p-[2px] leading-[16px] border border-gray min-w-[18px] rounded-[4px] flex items-center justify-center'>
                        +{remainingMembersCount}
                      </p>
                    )}
                  </div>
                );
              }
            })}
          </div>
        );
      })}
    </div>
  );
}
