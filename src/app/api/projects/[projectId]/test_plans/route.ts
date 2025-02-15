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
  });

  return NextResponse.json(testPlans);
}
