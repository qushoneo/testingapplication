// app/api/projects/[projectId]/folders/route.ts

import { getCompanyIdFromToken } from "@/app/api/lib/getCompanyIdFromToken";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = await params;

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const { companyId } = await getCompanyIdFromToken(token);
    if (!companyId) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const folders = await prisma.folder.findMany({
      where: {
        companyId: companyId,
        projectId: parseInt(projectId),
      },
      select: {
        id: true,
        name: true,
        description: true,
        parentId: true,
        children: true,
      },
    });

    return NextResponse.json(folders, { status: 200 });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { name, description, parentId } = await req.json();

    const { projectId } = await params;

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const { companyId } = await getCompanyIdFromToken(token);
    if (!companyId) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const newFolder = await prisma.folder.create({
      data: {
        name,
        description,
        parentId,
        projectId: parseInt(projectId),
        companyId,
      },
    });

    return NextResponse.json(newFolder, { status: 201 });
  } catch (error) {
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
