import { NextRequest, NextResponse } from 'next/server';
import { getCompanyIdFromToken } from '../../lib/getCompanyIdFromToken';
import ProjectController from '../../controllers/ProjectController';

// Single project Endpoints

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const token = req.cookies.get('token')?.value;

    const { projectId } = await params;

    if (!token) {
      throw new Error('No token');
    }

    const { id } = await getCompanyIdFromToken(token);

    if (!id) {
      throw new Error('Cannot find company id or user id');
    }

    const project = await ProjectController.getProject(parseInt(projectId));

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
