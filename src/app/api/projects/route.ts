import { NextRequest, NextResponse } from "next/server";
import { getCompanyIdFromToken } from "../lib/getCompanyIdFromToken";
import { getProject, getProjects } from "../lib/getProjects";
import { prisma } from "../lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    const { projectIds } = await req.json();

    if (!token) {
      throw new Error("No token");
    }

    const { companyId } = await getCompanyIdFromToken(token);

    if (!Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json(
        { error: "No project IDs provided" },
        { status: 400 }
      );
    }

    await prisma.project.deleteMany({
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
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      throw new Error("No token");
    }

    const { companyId } = await getCompanyIdFromToken(token);

    if (!companyId) {
      throw new Error("Cannot find company id");
    }

    const projects = await getProjects(companyId);

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

    const { companyId } = await getCompanyIdFromToken(token);

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

    const projectWithData = await getProject(newProject.id, companyId);

    return NextResponse.json(projectWithData, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
