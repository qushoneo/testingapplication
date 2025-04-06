import { prisma } from './prisma';

export const getProjects = async (companyId: number) => {
  return await prisma.project.findMany({
    where: { companyId: companyId },
    include: {
      users: true,
    },
  });
};

export const getProject = async (id: number, companyId: number) => {
  return await prisma.project.findUnique({
    where: { companyId: companyId, id: id },
  });
};
