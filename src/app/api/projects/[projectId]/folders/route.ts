import hasCircularReference from "@/app/api/lib/checkCircularReference";
import { getCompanyIdFromToken } from "@/app/api/lib/getCompanyIdFromToken";
import { prisma } from "@/app/api/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

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

export async function PUT(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { name, description, parentId, folderId } = await req.json();
    const { projectId } = params;

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const { companyId } = await getCompanyIdFromToken(token);
    if (!companyId) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const folderToUpdate = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folderToUpdate) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    if (await hasCircularReference(folderId, parentId)) {
      return NextResponse.json(
        { error: "Circular reference detected" },
        { status: 400 }
      );
    }

    if (folderToUpdate.projectId !== parseInt(projectId)) {
      return NextResponse.json({ error: "Project mismatch" }, { status: 400 });
    }

    const updatedFolder = await prisma.folder.update({
      where: { id: folderId },
      data: {
        name,
        description,
        parentId,
        projectId: parseInt(projectId),
        companyId,
      },
    });

    return NextResponse.json(updatedFolder, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
