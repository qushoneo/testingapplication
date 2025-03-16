import axios from 'axios';
import { fetcher } from '../lib/fetcher';
import { mutate } from 'swr';

const testCasesRequest = {
  createTestCase: async (
    parentFolderId: number,
    projectId: number | string,
    name: string,
    description: string,
    severity: string | null
  ) => {
    // return axios.post(`/api/projects/${projectId}/test_cases`, {
    //   folderId: parentFolderId,
    //   name,
    //   description,
    //   severity,
    // });

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
      data: { ids: testCaseIds },
    }).then((response) => {
      mutate(`/api/projects/${projectId}/test_cases`, (data: any) => {
        return data.filter(
          (testCase: any) => !testCaseIds.includes(testCase.id)
        );
      });
    });

    return response;
  },

  duplicateTestCases: async (testCaseIds: number[], projectId: number) => {
    return axios.post(`/api/projects/${projectId}/test_cases/duplicate`, {
      ids: testCaseIds,
    });
  },
};

export default testCasesRequest;
