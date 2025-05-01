import TestCaseController from '@/app/api/controllers/TestCaseController';
import { generateValidationErrors } from '@/app/api/lib/generateValidationErrors';
import { prisma } from '@/app/api/lib/prisma';
import { Severity, TestCase } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const TestCaseSchema = z.object({
  name: z.string().min(4, { message: 'At least 4 symbols' }),
  description: z.string().optional(),
  severity: z.nativeEnum(Severity).nullable().optional(),
  folderId: z.number(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; folderId: string }> }
) {
  try {
    const { projectId } = await params;

    const testCases = await TestCaseController.getAll(Number(projectId));

    return NextResponse.json(testCases, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const body = await req.json();
    const { projectId } = await params;
    const validation = TestCaseSchema.safeParse(body);

    if (!validation.success) {
      return generateValidationErrors(validation.error.errors);
    }

    const { name, description, severity, folderId } = validation.data;

    const newTestCase = TestCaseController.create(
      {
        name: name,
        description: description || '',
        severity: severity || null,
        folderId: folderId,
      },
      Number(projectId)
    );

    return NextResponse.json(newTestCase, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ testCaseId: string }> }
) {
  try {
    const { name, description, severity, folderId } = await req.json();

    if (!folderId) {
      return NextResponse.json(
        { error: 'folderId is required' },
        { status: 400 }
      );
    }

    const { testCaseId } = await params;

    const testCaseToUpdate = await prisma.testCase.findUnique({
      where: { id: parseInt(testCaseId) },
    });

    if (!testCaseToUpdate) {
      return NextResponse.json(
        { error: 'Test case not found' },
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
    console.error('Error updating test case:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ testCaseId: string }> }
) {
  try {
    const { testCaseId } = await params;

    const testCase = await prisma.testCase.findUnique({
      where: { id: parseInt(testCaseId) },
    });

    if (!testCase) {
      return NextResponse.json(
        { error: 'Test case not found' },
        { status: 404 }
      );
    }

    await prisma.testCase.delete({
      where: { id: parseInt(testCaseId) },
    });

    return NextResponse.json({ message: 'Test case deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting test case:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
