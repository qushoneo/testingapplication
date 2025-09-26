import { Status } from "@/types/Status";
import { fetcher } from "../lib/fetcher";
import { TestRun } from "@/types/TestRun";
import { mutate } from "swr";

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
  deleteTestRuns: async (testRunIds: number[], projectId: number) => {
    return fetcher(`/api/projects/${projectId}/test_runs`, {
      method: "DELETE",
      data: { testRunIds },
    })
      .then((res) => {
        mutate(
          `/api/projects/${projectId}/test_runs`,
          (data: TestRun[] | undefined) => {
            if (!data) return [];
            return data.filter((tr: TestRun) => !testRunIds.includes(tr.id));
          }
        );
        return res;
      })
      .catch((error) => {
        console.error("Error deleting test runs:", error);
        throw error;
      });
  },
  updateTestRun: async (
    projectId: number,
    id: number,
    name: string,
    environment: null,
    operationalSystem: null,
    screenSize: null
  ) => {
    return fetcher(`/api/projects/${projectId}/test_runs`, {
      method: "PATCH",
      data: {
        testRunId: id,
        name,
      },
    }).then((res) => {
      mutate(
        `/api/projects/${projectId}/test_runs`,
        (data: TestRun[] | undefined) => {
          if (!data) return [res];
          return data.map((tr: TestRun) => (tr.id === id ? res : tr));
        }
      );
    });
  },

  updateTestCaseRunStatus: async (
    projectId: number,
    testCaseRunId: number,
    status: Status
  ) => {
    return fetcher(
      `/api/projects/${projectId}/test_runs/test_case_run/${testCaseRunId}`,
      {
        method: "PATCH",
        data: { status },
      }
    ).then((res) => {
      mutate(
        `/api/projects/${projectId}/test_runs/test_case_run/${testCaseRunId}`,
        res
      );
      return res;
    });
  },
};

export default testRunsRequest;
