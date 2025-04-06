import { TestPlan as TestPlanType, TestCase } from '@prisma/client';

export type TestPlan = TestPlanType & { testCases: TestCase[] };
