"use client";

import { SeverityColor } from "@/components/SeverityColor";
import { TestCase } from "@prisma/client";

interface TestCaseProps {
  testCase: TestCase;
}

export default function ProjectTestCase({ testCase }: TestCaseProps) {
  return (
    <div className="flex gap-[12px] items-center overflow-hidden max-w-full">
      <SeverityColor value={testCase.severity} />

      <p className="text-[14px] min-w-[200px] whitespace-nowrap ">
        {testCase.name}
      </p>

      <p className="text-[14px] flex-grow whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
        {testCase.description}
      </p>
    </div>
  );
}
