import { verifyToken } from "@/app/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCompanyIdFromToken = async (token: string) => {
  const decodedToken = verifyToken(token);

  const user = await prisma.user.findUnique({
    where: {
      id: decodedToken.id,
    },
  });

  return { id: user?.id, companyId: user?.companyId };
};
