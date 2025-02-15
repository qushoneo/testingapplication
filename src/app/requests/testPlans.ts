import { TestPlan } from '@prisma/client';

import axios from 'axios';

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
    axios.post(`/api/projects/${projectId}/test_plans`, {
      name,
      description,
      testCases,
    }),
};

export default testPlansRequest;
