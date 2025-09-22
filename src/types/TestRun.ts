import { Status } from './Status';

export type TestRun = {
  id: number;
  name: string;
  userId: number;
  projectId: number;
  testPlanId: number;
  status: Status;
  createdAt: Date;
  duration?: number;
  optionalInfo?: any;
  testCases: number[]; 
};

