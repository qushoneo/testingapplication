import { NextResponse, NextRequest } from 'next/server';
import { getCompanyIdFromToken } from '@/app/api/lib/getCompanyIdFromToken';
import { prisma } from '@/app/api/lib/prisma';
import TestCaseController from '@/app/api/controllers/TestCaseController';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const { testCaseIds } = await req.json();

    const token = req.cookies.get('token')?.value;

    const { companyId } = await getCompanyIdFromToken(token);
    if (!companyId) {
      throw new Error('Cannot find company ID or user ID');
    }

    const testCases = await TestCaseController.findTestCasesById(testCaseIds);

    const duplicatedTestCases = await TestCaseController.duplicate(
      testCases,
      Number(projectId)
    );

    return NextResponse.json(duplicatedTestCases, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
