import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProjects = async (companyId: number) => {
  return await prisma.project.findMany({
    where: { companyId: companyId },
    include: {
      defects: {
        select: {
          id: true,
          name: true,
          severity: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          assignedUser: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      users: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const getProject = async (id: number, companyId: number) => {
  return await prisma.project.findUnique({
    where: { companyId: companyId, id: id },
    include: {
      defects: {
        select: {
          id: true,
          name: true,
          severity: true,
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          assignedUser: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      users: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};
