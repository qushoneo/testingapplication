import { getCompanyIdFromToken } from '@/app/api/lib/getCompanyIdFromToken';
import { prisma } from '@/app/api/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ testCaseId: string }> }
) {
  try {
    const { ids } = await req.json();

    if (ids.length === 0) {
      return NextResponse.json({ error: 'Nothing to delete' }, { status: 400 });
    }

    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const { companyId, id: userId } = await getCompanyIdFromToken(token);

    if (!companyId || !userId) {
      return NextResponse.json(
        { error: 'Cannot find company ID or user ID' },
        { status: 403 }
      );
    }

    const testCases = await prisma.testCase.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        project: true,
      },
    });

    const unauthorizedTestCases = testCases.filter(
      (testCase) => testCase.project.companyId !== companyId
    );

    if (unauthorizedTestCases.length > 0) {
      return NextResponse.json(
        { error: 'Unauthorized to delete these test cases' },
        { status: 403 }
      );
    }

    await prisma.testCase.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json(
      { message: 'Test cases deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting test cases:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
