import { Defect } from "@prisma/client";
import { fetcher } from "../lib/fetcher";

const defectsRequest = {
  createDefects: async (testCaseRunId: number, defects: Defect[]) => {
    return fetcher(`/api/defects`, {
      method: "POST",
      data: { testCaseRunId, defects },
    });
  },
};

export default defectsRequest;
