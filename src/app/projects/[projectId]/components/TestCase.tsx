'use client';

import Checkbox from '@/components/Checkbox';
import { SeverityColor } from '@/components/SeverityColor';
import { TestCase } from '@prisma/client';
import { useTestCasesStore } from '@/stores/useTestCasesStore';

interface TestCaseProps {
  testCase: TestCase;
}

export default function ProjectTestCase({ testCase }: TestCaseProps) {
  const { selectTestCase, unselectTestCase, selectedTestCases } =
    useTestCasesStore();

  const isSelected = !!selectedTestCases.find(
    (selectedTestCase) => selectedTestCase.id === testCase.id
  );

  const switchTestCaseSelection = () => {
    if (isSelected) {
      unselectTestCase(testCase.id);
    } else {
      selectTestCase(testCase);
    }
  };

  return (
    <div
      onClick={switchTestCaseSelection}
      className='pl-[40px] group items-center flex max-w-full relative cursor-pointer'
    >
      <Checkbox
        className={`absolute left-[0px] ${
          isSelected ? 'block' : 'hidden'
        }  group-hover:block`}
        isActive={isSelected}
      />

      <div className='flex gap-[12px] overflow-hidden items-center'>
        <SeverityColor value={testCase.severity} />

        <p className='text-[14px] min-w-[200px] whitespace-nowrap '>
          {testCase.name}
        </p>

        <p className='text-[14px] flex-grow whitespace-nowrap overflow-hidden text-ellipsis max-w-full'>
          {testCase.description}
        </p>
      </div>
    </div>
  );
}
