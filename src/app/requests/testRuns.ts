import { Status } from "@/types/Status";
import { fetcher } from "../lib/fetcher";

const testRunsRequest = {
  createTestRun: async (testRun: {
    name: string;
    projectId: number;
    userId: number;
    testPlanId: number;
    status: Status;
    testCaseIds: number[];
  }) => {
    return fetcher(`/api/projects/${testRun.projectId}/test_runs`, {
      method: "POST",
      data: testRun,
    });
  },
};

export default testRunsRequest;