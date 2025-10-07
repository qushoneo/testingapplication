import { Severity } from "@prisma/client";
import { fetcher } from "../lib/fetcher";

export const testCaseRunRequest = {
  createTestCaseRunDefects: async (
    testRunId: number,
    defects: Array<{
      name: string;
      description?: string;
      severity?: Severity;
      authorId?: number;
      assignedUserId?: number;
    }>
  ) => {
    return fetcher(`/api/defects`, {
      method: "POST",
      data: {
        testRunId,
        defects,
      },
    });
  },
};
