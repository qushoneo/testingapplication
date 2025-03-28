import { prisma } from '@/app/api/lib/prisma';
import testPlansRequest from '@/app/requests/testPlans';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
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
}

import { z } from 'zod';

export const testPlanSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  testCases: z.array(z.number()).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  const { name, description, testCases } = await req.json();

  const { success } = testPlanSchema.safeParse({
    name,
    description,
    testCases,
  });

  if (!success) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
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
}
