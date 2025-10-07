import { Severity } from "@prisma/client";
import { fetcher } from "../lib/fetcher";

export const testCaseRunRequest = {
  createTestCaseRunDefects: async (
    testrunId: number,
    defects: Array<{
      name: string;
      description?: string;
      severity?: Severity;
      assignedUserId?: number;
    }>
  ) => {
    return fetcher(`/api/${testrunId}/defects`, {
      method: "POST",
      data: defects,
    });
  },
};
