import { fetcher } from '../lib/fetcher';
import { mutate } from 'swr';

const testCasesRequest = {
  getTestCasesByProjectId: async (projectId: number) => {
    return fetcher(`/api/projects/${projectId}/test_cases`);
  },

  createTestCase: async (
    parentFolderId: number,
    projectId: number | string,
    name: string,
    description: string,
    severity: string | null
  ) => {
    return fetcher(`/api/projects/${projectId}/test_cases`, {
      method: 'POST',
      data: {
        folderId: parentFolderId,
        name,
        description,
        severity,
      },
    }).then((response) => {
      mutate(`/api/projects/${projectId}/test_cases`, (data: any) => {
        console.log([...data, response]);
        return [...data, response];
      });
    });
  },

  deleteTestCases: async (testCaseIds: number[], projectId: number) => {
    const response = fetcher(`/api/projects/${projectId}/test_cases/bulk`, {
      method: 'DELETE',
      data: { testCaseIds: testCaseIds },
    }).then(() => {
      mutate(`/api/projects/${projectId}/test_cases`, (data: any) => {
        return data.filter(
          (testCase: any) => !testCaseIds.includes(testCase.id)
        );
      });
    });

    return response;
  },

  duplicateTestCases: async (testCaseIds: number[], projectId: number) => {
    return fetcher(`/api/projects/${projectId}/test_cases/duplicate`, {
      method: 'POST',
      data: { testCaseIds: testCaseIds },
    }).then((response) => {
      mutate(`/api/projects/${projectId}/test_cases`, (data: any) => {
        return [...data, response];
      });
    });
  },
};

export default testCasesRequest;
