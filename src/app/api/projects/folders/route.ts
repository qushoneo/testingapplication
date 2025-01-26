// app/api/projects/[projectId]/folders/route.ts

import { NextRequest, NextResponse } from "next/server";

import { getCompanyIdFromToken } from "../../lib/getCompanyIdFromToken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    // Получение companyId из токена (если у вас есть такая логика в getCompanyIdFromToken)
    const { companyId } = await getCompanyIdFromToken(token);
    if (!companyId) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Получаем все папки для проекта
    const folders = await prisma.folder.findMany({
      where: {
        companyId: companyId,
        projectId: parseInt(projectId), // Преобразуем projectId в число
      },
      select: {
        id: true,
        name: true,
        description: true,
        parentId: true,
        children: true,
      },
    });

    if (!folders || folders.length === 0) {
      return NextResponse.json(
        { error: "No folders found for this project" },
        { status: 404 }
      );
    }

    return NextResponse.json(folders, { status: 200 });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
