import { Project, TestCase } from '@prisma/client';
import { prisma } from '../lib/prisma';

class TestCaseController {
  async bulkDelete(testCaseIds: TestCase['id'][]) {
    const deletedTestCases = await prisma.testCase.deleteMany({
      where: {
        id: { in: testCaseIds },
      },
    });

    return deletedTestCases;
  }

  async delete(id: TestCase['id']) {
    const deletedTestCases = await prisma.testCase.delete({
      where: {
        id: id,
      },
    });

    return deletedTestCases;
  }

  async duplicate(testCases: TestCase[], projectId: Project['id']) {
    const duplicatedTestCases = await prisma.$transaction(
      testCases.map((testCase) =>
        prisma.testCase.create({
          data: {
            name: `${testCase.name} (Copy)`,
            description: testCase.description,
            severity: testCase.severity,
            folderId: testCase.folderId,
            projectId: projectId,
          },
        })
      )
    );

    return duplicatedTestCases;
  }

  async findTestCasesById(testCaseIds: TestCase['id'][]) {
    const testCases = await prisma.testCase.findMany({
      where: {
        id: { in: testCaseIds },
      },
    });

    return testCases;
  }

  async getAll(projectId: Project['id']) {
    const testCases = await prisma.testCase.findMany({
      where: {
        projectId: projectId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        severity: true,
        createdAt: true,
        folderId: true,
      },
    });

    return testCases;
  }

  async create(
    testCase: Pick<TestCase, 'name' | 'description' | 'severity' | 'folderId'>,
    projectId: number
  ) {
    const newTestCase = await prisma.testCase.create({
      data: {
        ...testCase,
        projectId: projectId,
      },
    });

    return newTestCase;
  }

  async update(
    id: TestCase['id'],
    folder: Pick<TestCase, 'name' | 'description' | 'severity' | 'folderId'>
  ) {
    const testCase = await prisma.testCase.update({
      where: { id: Number(id) },
      data: folder,
    });

    return testCase;
  }

  async findById(id: TestCase['id']) {
    const testCase = await prisma.testCase.findUnique({
      where: { id: Number(id) },
    });

    return testCase;
  }
}

export default new TestCaseController();
