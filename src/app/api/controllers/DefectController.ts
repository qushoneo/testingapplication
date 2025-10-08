import { Defect } from "@prisma/client";
import { prisma } from "../lib/prisma";

class DefectController {
  async create(defect: Defect) {
    const createdDefect = await prisma.defect.create({
      data: defect,
    });

    return createdDefect;
  }

  async createBulk(
    defects: Array<
      Pick<
        Defect,
        | "name"
        | "description"
        | "severity"
        | "authorId"
        | "assignedUserId"
        | "projectId"
      >
    >,
    testCaseRunId: number
  ) {
    const createdDefects = await prisma.defect.createMany({
      data: defects.map((defect) => ({
        ...defect,
        testCaseRunId,
      })),
    });

    return createdDefects;
  }

  async update(
    defect: Pick<
      Defect,
      "id" | "name" | "description" | "severity" | "assignedUserId"
    >
  ) {
    const { id, ...updateData } = defect;
    return prisma.defect.update({
      where: { id },
      data: updateData,
    });
  }

  async getDefectsByTestCaseRunId(testCaseRunId: number) {
    return prisma.defect.findMany({
      where: { testCaseRunId },
    });
  }
}

export default new DefectController();
