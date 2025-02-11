import axios from 'axios';

const testCasesRequest = {
  getAllTestCases: async (projectId: number | string) => {
    return axios.get(`/api/projects/${projectId}/test_cases`);
  },

  createTestCase: async (
    parentFolderId: number,
    projectId: number | string,
    name: string,
    description: string,
    severity: string | null
  ) => {
    return axios.post(`/api/projects/${projectId}/test_cases`, {
      folderId: parentFolderId,
      name,
      description,
      severity,
    });
  },

  deleteBulk: async (testCaseIds: number[], projectId: number) => {
    return axios.delete(`/api/projects/${projectId}/test_cases/bulk`, {
      data: { ids: testCaseIds },
    });
  },

  duplicateTestCases: async (testCaseIds: number[], projectId: number) => {
    return axios.post(`/api/projects/${projectId}/test_cases/duplicate`, {
      ids: testCaseIds,
    });
  },
};

export default testCasesRequest;
