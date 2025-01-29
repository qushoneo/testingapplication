import { prisma } from "@/app/api/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string; folderId: string } }
) {
  try {
    const { projectId } = await params;

    const testCases = await prisma.testCase.findMany({
      where: {
        projectId: parseInt(projectId),
      },
      select: {
        id: true,
        name: true,
        description: true,
        severity: true,
        createdAt: true,
        folderId: true,
      },
    });

    return NextResponse.json(testCases, { status: 200 });
  } catch (error) {
    console.error("Error fetching test cases:", error);
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
    const { name, description, severity, folderId } = await req.json();

    if (!folderId) {
      return NextResponse.json(
        { error: "folderId is required" },
        { status: 400 }
      );
    }

    const { projectId } = await params;

    const newTestCase = await prisma.testCase.create({
      data: {
        name,
        description,
        severity: severity?.toUpperCase() || null,
        projectId: parseInt(projectId),
        folderId: parseInt(folderId),
      },
    });

    return NextResponse.json(newTestCase, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { testCaseId: string } }
) {
  try {
    const { name, description, severity, folderId } = await req.json();

    if (!folderId) {
      return NextResponse.json(
        { error: "folderId is required" },
        { status: 400 }
      );
    }

    const { testCaseId } = params;

    const testCaseToUpdate = await prisma.testCase.findUnique({
      where: { id: parseInt(testCaseId) },
    });

    if (!testCaseToUpdate) {
      return NextResponse.json(
        { error: "Test case not found" },
        { status: 404 }
      );
    }

    const updatedTestCase = await prisma.testCase.update({
      where: { id: parseInt(testCaseId) },
      data: {
        name,
        description,
        severity,
        folderId: parseInt(folderId),
      },
    });

    return NextResponse.json(updatedTestCase, { status: 200 });
  } catch (error) {
    console.error("Error updating test case:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { testCaseId: string } }
) {
  try {
    const { testCaseId } = params;

    const testCase = await prisma.testCase.findUnique({
      where: { id: parseInt(testCaseId) },
    });

    if (!testCase) {
      return NextResponse.json(
        { error: "Test case not found" },
        { status: 404 }
      );
    }

    await prisma.testCase.delete({
      where: { id: parseInt(testCaseId) },
    });

    return NextResponse.json({ message: "Test case deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting test case:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
