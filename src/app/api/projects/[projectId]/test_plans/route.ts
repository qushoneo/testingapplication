import TestPlanController from '@/app/api/controllers/TestPlanController';
import { generateValidationErrors } from '@/app/api/lib/generateValidationErrors';
import { prisma } from '@/app/api/lib/prisma';
import { TestPlan } from '@/types/TestPlan';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createTestPlanSchema = z.object({
  name: z.string().min(4, { message: 'Name must be at least 4 symbols' }),
  description: z.string().optional(),
  testCases: z.array(z.number()).optional().default([]),
});

const updateTestPlanSchema = z.object({
  id: z.number(),
  name: z.string().min(4, { message: 'Name must be at least 4 symbols' }),
  description: z.string().optional(),
  testCases: z.array(z.number()).optional().default([]),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    const testPlans = await TestPlanController.getAll(Number(projectId));

    return NextResponse.json(testPlans);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch test plans' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    const body = await req.json();

    const validation = createTestPlanSchema.safeParse(body);

    if (!validation.success) {
      return generateValidationErrors(validation.error.errors);
    }

    const existingTestPlan = await TestPlanController.findByName(
      validation.data.name,
      Number(projectId)
    );

    if (existingTestPlan) {
      return NextResponse.json(
        [{ field: 'name', message: 'Test plan with this name already exists' }],
        { status: 400 }
      );
    }

    const testPlan = await TestPlanController.create({
      name: validation.data.name,
      description: validation.data.description,
      projectId: Number(projectId),
      testCases: validation.data.testCases.map((testCase: number) => ({
        id: testCase,
      })),
    } as TestPlan);

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

    await TestPlanController.bulkDelete(testPlanIds);

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
    const body = await req.json();

    const validation = updateTestPlanSchema.safeParse(body);

    if (!validation.success) {
      return generateValidationErrors(validation.error.errors);
    }

    const testPlan = await TestPlanController.update({
      id: validation.data.id,
      name: validation.data.name,
      description: validation.data.description,
      testCases: validation.data.testCases.map((testCase: number) => ({
        id: testCase,
      })),
    } as TestPlan);

    return NextResponse.json(testPlan);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update test plan' },
      { status: 500 }
    );
  }
}
