import { TestRun } from "@/types/TestRun";
import { TestCaseRun } from "@/types/TestCaseRun";

export const getTestRunFolderIds = (testRun: TestRun): number[] => {
  const ids = new Set<number>();
  testRun.testCaseRuns.forEach((tcr: TestCaseRun) => {
    ids.add(tcr.testCase.folderId);
  });
  return Array.from(ids);
};
