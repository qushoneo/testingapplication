import { TestCaseStatus, TestRun } from '@prisma/client';
import { prisma } from '../lib/prisma';

class TestRunController {
  async create(
    testRun: Pick<TestRun, 'name' | 'projectId' | 'userId' | 'testPlanId' | 'status'>,
    testCaseIds: number[]
  ) {
    const createdTestRun = await prisma.testRun.create({
      data: {
        name: testRun.name,
        projectId: testRun.projectId,
        userId: testRun.userId,
        testPlanId: testRun.testPlanId,
        status: testRun.status,
        testCases: {
          connect: testCaseIds.map(id => ({ id }))
        }
      },
      include: {
        testCases: true,
      },
    });

    await this.createTestCaseRun(testCaseIds, createdTestRun.id);

    return createdTestRun;
  }

  async createTestCaseRun(testCaseIds: number[], testRunId: number) {
    await prisma.testCaseRun.createMany({
      data: testCaseIds.map(testCaseId => ({
        testRunId: testRunId,
        testCaseId: testCaseId,
        status: TestCaseStatus.untested,
      })),
    });
  }

  async getDetailedTestRun(id: TestRun['id']) {
    return await prisma.testRun.findUnique({
      where: { id: id },
      include: {
        testCaseRuns: {
          include: {
            testCase: true,
          },
        },
        testCases: true,
      },
    });
  }

  async findById(id: TestRun['id']) {
    return await prisma.testRun.findUnique({
      where: { id: id },
      include: {
        testCases: true,
      },
    });
  }



  async findByName(name: TestRun['name'], projectId: TestRun['projectId']) {
    const testRun = await prisma.testRun.findFirst({
      where: {
        name: name,
        projectId: projectId,
      },
    });

    return testRun;
  }

  async getAll(projectId: TestRun['projectId']) {
    const testRuns = await prisma.testRun.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        testCases: true,
      }
    });

    return testRuns;
  }

  async update(
    id: number,
    updates: Partial<Pick<TestRun, 'name' | 'projectId' | 'userId' | 'testPlanId' | 'status'>>,
    testCaseIds?: number[]
  ) {
    const updatedTestRun = prisma.testRun.update({
      where: { id },
      data: {
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.projectId !== undefined && { projectId: updates.projectId }),
        ...(updates.userId !== undefined && { userId: updates.userId }),
        ...(updates.testPlanId !== undefined && { testPlanId: updates.testPlanId }),
        ...(updates.status !== undefined && { status: updates.status }),
        ...(testCaseIds && {
          testCases: {
            set: testCaseIds.map((id) => ({ id }))
          }
        })
      },
      include: {
        testCases: true,
      },
    });

    return updatedTestRun;
  }

  async bulkDelete(testRunIds: TestRun['id'][]) {
    const deletedTestRun = await prisma.$transaction(async (tx) => {
      await tx.testRun.deleteMany({
        where: {
          id: { in: testRunIds },
        },
      });
    });

    return deletedTestRun;
  }
}

export default new TestRunController();
