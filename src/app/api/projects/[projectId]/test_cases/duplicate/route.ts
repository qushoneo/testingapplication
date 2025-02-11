import { NextResponse, NextRequest } from 'next/server';
import { getProject } from '@/app/api/lib/getProjects';
import { getCompanyIdFromToken } from '@/app/api/lib/getCompanyIdFromToken';
import { prisma } from '@/app/api/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const { ids } = await req.json();

    const token = req.cookies.get('token')?.value;

    if (!token) {
      throw new Error('No token');
    }

    const { id, companyId } = await getCompanyIdFromToken(token);
    if (!companyId || !id) {
      throw new Error('Cannot find company ID or user ID');
    }

    const project = await getProject(parseInt(projectId), companyId);
    if (!project || project.companyId !== companyId) {
      return NextResponse.json(
        { error: 'Unauthorized to modify this project' },
        { status: 403 }
      );
    }

    const testCases = await prisma.testCase.findMany({
      where: {
        id: {
          in: ids,
        },
        projectId: parseInt(projectId),
      },
    });

    if (testCases.length === 0) {
      return NextResponse.json(
        { error: 'No test cases found for the provided IDs' },
        { status: 404 }
      );
    }

    const duplicatedTestCases = await prisma.$transaction(
      testCases.map((testCase) =>
        prisma.testCase.create({
          data: {
            name: `${testCase.name} (Copy)`,
            description: testCase.description,
            severity: testCase.severity,
            folderId: testCase.folderId,
            projectId: parseInt(projectId),
          },
        })
      )
    );

    return NextResponse.json(duplicatedTestCases, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
