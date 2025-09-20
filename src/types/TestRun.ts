import { Status } from './Status';

export type TestRun = {
  id: number;
  name: string;
  status: Status;
  authorId: number;
  time: number;
  testPlanId: number;
  testRunStatistics: [];
};
