import { verifyToken } from "@/app/lib/auth";

import { prisma } from "./prisma";

export const getCompanyIdFromToken = async (token: string) => {
  try {
    const decodedToken = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });

    return { id: user?.id, companyId: user?.companyId };
  } catch (e) {
    throw new Error("error");
  }
};
