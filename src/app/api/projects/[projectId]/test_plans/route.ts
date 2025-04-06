import { prisma } from '@/app/api/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    const testPlans = await prisma.testPlan.findMany({
      where: {
        projectId: parseInt(projectId),
      },
      include: {
        testCases: true,
      },
    });

    return NextResponse.json(testPlans);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch test plans' },
      { status: 500 }
    );
  }
}

import { z } from 'zod';

export const testPlanSchema = z.object({
  name: z.string().min(4, { message: 'Name must be at least 4 symbols' }),
  description: z.string().optional(),
  testCases: z.array(z.number()).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    const { name, description, testCases } = await req.json();

    const { success, error } = testPlanSchema.safeParse({
      name,
      description,
      testCases,
    });

    const existingTestPlan = await prisma.testPlan.findFirst({
      where: {
        name,
        projectId: parseInt(projectId),
      },
    });

    if (existingTestPlan) {
      return NextResponse.json(
        [{ field: 'name', message: 'Test plan with this name already exists' }],
        { status: 400 }
      );
    }

    if (!success) {
      return NextResponse.json(
        error?.errors.map((_err) => ({
          field: _err.path[0],
          message: _err.message,
        })),
        { status: 400 }
      );
    }

    const testPlan = await prisma.testPlan.create({
      data: {
        name,
        description,
        projectId: parseInt(projectId),
        testCases: {
          connect: testCases.map((testCase: number) => ({ id: testCase })),
        },
      },
      include: {
        testCases: true,
      },
    });

    return NextResponse.json(testPlan);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create test plan' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    const { testPlanIds } = await req.json();

    await prisma.$transaction(async (tx) => {
      await tx.testPlan.deleteMany({
        where: {
          id: { in: testPlanIds },
          projectId: parseInt(projectId),
        },
      });
    });

    return NextResponse.json({ message: 'Test plans deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete test plans' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { testPlanId, name, description, testCases } = await req.json();

    const { success, error } = testPlanSchema.safeParse({
      name,
      description,
      testCases,
    });

    if (!success) {
      return NextResponse.json(
        error?.errors.map((_err) => ({
          field: _err.path[0],
          message: _err.message,
        })),

        { status: 400 }
      );
    }

    const testPlan = await prisma.testPlan.update({
      where: { id: testPlanId },
      data: {
        name,
        description,
        testCases: {
          connect: testCases.map((testCase: number) => ({ id: testCase })),
        },
      },
      include: {
        testCases: true,
      },
    });

    return NextResponse.json(testPlan);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update test plan' },
      { status: 500 }
    );
  }
}
