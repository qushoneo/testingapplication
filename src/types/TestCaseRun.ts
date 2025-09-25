import { TestCase } from "@prisma/client";
import { Status } from "./Status";

export type TestCaseRun = {
  id: number;
  testRunId: number;
  testCaseId: number;
  status: Status;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  testCase: TestCase;
};
