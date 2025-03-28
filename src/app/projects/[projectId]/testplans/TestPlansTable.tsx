import Link from 'next/link';
import Checkbox from '@/components/Checkbox';
import { useFetch } from '@/app/hooks/useFetch';
import { TestPlan, TestCase } from '@prisma/client';

export default function ProjectsTable({ projectId }: { projectId: number }) {
  const { data: testPlans } = useFetch(`projects/${projectId}/test_plans`);

  const isSelected = false;

  const projecsTableFields = [
    { name: 'name', width: 'w-[15%] min-w-[230px]' },
    { name: 'test_cases', width: 'w-[15%] min-w-[210px]' },
    { name: 'description', width: 'w-[70%] flex-1' },
  ];

  return (
    <div className='mt-[12px] flex flex-col gap-[4px] relative z-1'>
      {testPlans.map((testPlan: TestPlan & { testCases: TestCase[] }) => {
        // const isSelected = !!selectedProjects.find(
        //   (project) => _project.id === project.id
        // );

        return (
          <div
            key={testPlan.id}
            className={`flex gap-[12px] px-[32px] py-[4px] ${
              isSelected ? 'bg-lightgray' : ''
            } group cursor-pointer`}
          >
            <Checkbox
              isActive={isSelected}
              onClick={(e) => {
                e.stopPropagation();
                // if (isSelected) {
                //   unselectProject(project.id);
                // } else {
                //   selectProject(project);
                // }
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
                    {testPlan.name}
                  </p>
                );

              if (field.name === 'test_cases') {
                return (
                  <p
                    key={'col-' + j}
                    className={`text-sm text-textPrimary ${field.width}`}
                  >
                    {testPlan.testCases.length + ' test cases'}
                  </p>
                );
              }

              if (field.name === 'description') {
                return (
                  <p
                    key={'col-' + j}
                    className={`text-sm text-textPrimary ${field.width}`}
                  >
                    {testPlan.description}
                  </p>
                );
              }
            })}
          </div>
        );
      })}
    </div>
  );
}
