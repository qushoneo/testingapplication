import { NextRequest, NextResponse } from 'next/server';
import { getCompanyIdFromToken } from '../lib/getCompanyIdFromToken';
import ProjectController from '../controllers/ProjectController';
import { z } from 'zod';
import { generateValidationErrors } from '../lib/generateValidationErrors';
import { endpoints } from '../lib/clientEndpoints';
import SocketServices from '../services/SocketServices';
import NotificationController from '../controllers/NotificationController';

// Projects Endpoints

const createProjectSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Project name requires at least 4 characters' }),
});

export async function DELETE(req: NextRequest) {
  try {
    const { projectIds } = await req.json();

    const token = req.cookies.get('token')?.value;

    const { companyId } = await getCompanyIdFromToken(token);

    await ProjectController.deleteProject(projectIds);

    await SocketServices.sendToSocket(
      { projectIds: projectIds, companyId: companyId },
      endpoints.DELETE_PROJECT
    );

    return NextResponse.json(
      {
        projectIds,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      NextResponse.json({ message: "Don't have token" }, { status: 403 });
    }

    const { companyId } = await getCompanyIdFromToken(token);

    if (!companyId) {
      throw new Error('Cannot find company id');
    }

    const projects = await ProjectController.getAllProjects(companyId);

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error -' + error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    const { companyId, id } = await getCompanyIdFromToken(token);

    const body = (await req.json()) as { name: string; companyId: number };

    const validation = createProjectSchema.safeParse(body);

    if (!validation.success) {
      return generateValidationErrors(validation.error.errors);
    }

    const { name } = validation.data;

    const existingProject = await ProjectController.findProjectByName(
      name,
      companyId!
    );

    if (existingProject) {
      return NextResponse.json(
        [
          {
            field: 'name',
            message: 'Project name already in use',
          },
        ],
        { status: 400 }
      );
    }

    const newProject = await ProjectController.createProject(name, companyId!);

    await NotificationController.create({
      message: `Project ${newProject.name} has been successfully created`,
      userId: Number(id),
    });

    await SocketServices.sendToSocket(
      { project: newProject, companyId: companyId },
      endpoints.CREATE_PROJECT_COMPANY
    );

    await SocketServices.sendToSocket(
      {
        userId: id,
      },
      endpoints.ADD_NOTIFICATION_USER
    );

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
