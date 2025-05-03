import TestCaseController from '@/app/api/controllers/TestCaseController';
import { NextRequest, NextResponse } from 'next/server';

// TestCases

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ testCaseId: string }> }
) {
  try {
    const { testCaseIds } = await req.json();

    await TestCaseController.bulkDelete(testCaseIds);

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
