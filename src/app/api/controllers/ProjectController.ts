import { Project } from '@prisma/client';
import { prisma } from '../lib/prisma';

class ProjectController {
  async getProject(projectId: string | number) {
    const project = await prisma.project.findUnique({
      where: { id: Number(projectId) },
    });

    return project;
  }

  async findProjectByName(
    projectName: Project['name'],
    companyId: Project['companyId']
  ): Promise<Project | null> {
    const findedProject = await prisma.project.findFirst({
      where: {
        name: projectName,
        companyId: Number(companyId),
      },
    });

    return findedProject;
  }

  async getAllProjects(companyId: Project['companyId']) {
    const projects = await prisma.project.findMany({
      where: {
        companyId: Number(companyId),
      },
    });

    return projects;
  }

  async createProject(
    name: Project['name'],
    companyId: Project['companyId']
  ): Promise<Project> {
    const newProject = await prisma.project.create({
      data: {
        name: name,
        companyId: companyId,
      },
    });

    return newProject;
  }

  async createMockProjects(companyId: Project['companyId']) {
    const projectData = [];
    for (let i = 1; i <= 50; i++) {
      projectData.push({
        name: `Mock Project ${i}`,
        companyId: companyId,
      });
    }

    const result = await prisma.project.createMany({
      data: projectData,
      skipDuplicates: true, // Optional: Skip if a project with the same unique constraint already exists
    });

    return result; // Returns { count: number }
  }

  async deleteProject(projectIds: Project['id'][]) {
    const deletedProject = await prisma.project.deleteMany({
      where: {
        id: { in: projectIds },
      },
    });

    return deletedProject;
  }
}

export default new ProjectController();
