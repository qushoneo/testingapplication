import { TestPlan } from '@prisma/client';

import axios from 'axios';
import { fetcher } from '../lib/fetcher';

const testPlansRequest = {
  getAllTestPlans: async (projectId: number) =>
    axios.get(`/api/projects/${projectId}/test_plans`),

  getTestPlanById: async (testPlanId: number) =>
    axios.get(`/api/test_plans/${testPlanId}`),

  createTestPlan: async (
    projectId: number,
    name: string,
    description: string,
    testCases: number[]
  ) =>
    fetcher(`/api/projects/${projectId}/test_plans`, {
      method: 'POST',
      data: {
        name,
        description,
        testCases,
      },
    }),
};

export default testPlansRequest;
