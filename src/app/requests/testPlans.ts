import { fetcher } from '../lib/fetcher';
import { mutate } from 'swr';
import { TestPlan } from '@prisma/client';

const testPlansRequest = {
  getAllTestPlans: async (projectId: number) =>
    fetcher(`/api/projects/${projectId}/test_plans`),

  getTestPlanById: async (testPlanId: number) =>
    fetcher(`/api/test_plans/${testPlanId}`),

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
    }).then((res) => {
      mutate(`/api/projects/${projectId}/test_plans`, (data: any) => [
        ...data,
        res,
      ]);
    }),

  deleteTestPlan: async (testPlanIds: number[], projectId: number) =>
    fetcher(`/api/projects/${projectId}/test_plans`, {
      method: 'DELETE',
      data: {
        testPlanIds,
      },
    }).then((res) => {
      mutate(`/api/projects/${projectId}/test_plans`, (data: any) =>
        data.filter((tp: TestPlan) => !testPlanIds.includes(tp.id))
      );
    }),

  updateTestPlan: async (
    projectId: number,
    id: number,
    name: string,
    description: string,
    testCases: number[]
  ) =>
    fetcher(`/api/projects/${projectId}/test_plans`, {
      method: 'PUT',
      data: {
        id,
        name,
        description,
        testCases,
      },
    }).then((res) => {
      mutate(`/api/projects/${projectId}/test_plans`, (data: any) =>
        data.map((tp: TestPlan) => (tp.id === id ? res : tp))
      );
    }),
};

export default testPlansRequest;
