import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getCompanyIdFromToken } from "../lib/getCompanyIdFromToken";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    const { projectIds } = await req.json(); // Accept an array of project IDs

    if (!token) {
      throw new Error("No token");
    }

    const companyId = await getCompanyIdFromToken(token);

    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json(
        { error: "No project IDs provided" },
        { status: 400 }
      );
    }

    const deleteResult = await prisma.project.deleteMany({
      where: {
        id: { in: projectIds },
        companyId: companyId,
      },
    });

    return NextResponse.json(
      {
        projectIds,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      throw new Error("No token");
    }

    const companyId = await getCompanyIdFromToken(token);

    const projects = await prisma.project.findMany({
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

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let errors: { field: string; message: string }[] = [];
    const token = req.cookies.get("token")?.value;

    if (!token) {
      throw new Error("No token");
    }

    const companyId = await getCompanyIdFromToken(token);

    if (!companyId) {
      throw new Error("Internal server error");
    }

    const { projectName } = await req.json();

    const existingProject = await prisma.project.findFirst({
      where: {
        companyId: companyId,
        name: projectName,
      },
    });

    if (existingProject) {
      errors.push({
        field: "project_name",
        message: "Project name already in use",
      });
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const newProject = await prisma.project.create({
      data: {
        name: projectName,
        companyId: companyId,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
