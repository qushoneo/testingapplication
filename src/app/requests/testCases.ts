import axios from "axios";

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
      severity: severity,
    });
  },
};

export default testCasesRequest;
