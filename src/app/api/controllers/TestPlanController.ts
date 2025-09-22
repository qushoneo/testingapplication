import { Project } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { TestPlan } from '@/types/TestPlan';

class TestPlanController {
  async create(
    testPlan: Pick<TestPlan, 'name' | 'projectId' | 'description' | 'testCases'>
  ) {
    const createdTestPlan = await prisma.testPlan.create({
      data: {
        name: testPlan.name,
        projectId: testPlan.projectId,
        description: testPlan.description,
        testCases: {
          connect: testPlan.testCases,
        },
      },
      include: {
        testCases: true,
      },
    });

    return createdTestPlan;
  }

  async findById(id: TestPlan['id']) {
    return await prisma.testPlan.findUnique({
      where: { id: id },
      include: {
        testCases: true,
      },
    });
  }

  async findByName(name: TestPlan['name'], projectId: TestPlan['projectId']) {
    const testPlan = await prisma.testPlan.findFirst({
      where: {
        name: name,
        projectId: projectId,
      },
    });

    return testPlan;
  }

  async getAll(projectId: TestPlan['projectId']) {
    const testPlans = await prisma.testPlan.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        testCases: true,
      },
    });

    return testPlans;
  }

  async update(
    testPlan: Pick<
      TestPlan,
      'name' | 'projectId' | 'description' | 'testCases' | 'id'
    >
  ) {
    const updatedTestPlan = prisma.testPlan.update({
      where: { id: testPlan.id },
      data: {
        name: testPlan.name,
        projectId: testPlan.projectId,
        description: testPlan.description,
        testCases: {
          connect: testPlan.testCases,
        },
      },
      include: {
        testCases: true,
      },
    });

    return updatedTestPlan;
  }

  async bulkDelete(testPlanIds: TestPlan['id'][]) {
    const deletedTestPlan = await prisma.$transaction(async (tx) => {
      await tx.testPlan.deleteMany({
        where: {
          id: { in: testPlanIds },
        },
      });
    });

    return deletedTestPlan;
  }
}

export default new TestPlanController();
