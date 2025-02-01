import { TestCase } from "@prisma/client";

type TestCaseProps = {
  testCase: TestCase;
};

export default function CaseTest({ testCase }: TestCaseProps) {
  return (
    <div className="flex items-center gap-[5px] ml-[14px]">
      <div>•</div>
      <p className="text-[14px]">{testCase.name}</p>
    </div>
  );
}
