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
    console.error('Error deleting test case:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
