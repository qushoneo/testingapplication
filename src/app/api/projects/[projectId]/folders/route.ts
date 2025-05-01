import { prisma } from '@/app/api/lib/prisma';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';
import FolderController from '@/app/api/controllers/FolderController';
import { getCompanyIdFromToken } from '@/app/api/lib/getCompanyIdFromToken';
import { generateValidationErrors } from '@/app/api/lib/generateValidationErrors';

const createFolderSchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Folder name must contain at least 4 characters' })
    .max(20, {
      message: "Folder name mustn't contain more than 20 characters",
    }),
  parentId: z.number().nullable().default(null),
  description: z.string().default(''),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    const folders = await FolderController.getProjectFolders(
      parseInt(projectId)
    );

    return NextResponse.json(folders, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to get project' + e },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const body = await req.json();

    const validation = createFolderSchema.safeParse(body);

    const { projectId } = await params;

    const token = req.cookies.get('token')?.value;

    if (!validation.success) {
      return generateValidationErrors(validation.error.errors);
    }

    const { companyId } = await getCompanyIdFromToken(token);

    if (!companyId) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const { name, parentId } = validation.data;

    const newFolder = await FolderController.createFolder(
      name,
      companyId,
      parseInt(projectId),
      parentId
    );

    return NextResponse.json(newFolder, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to get project' + e },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { folderId } = await req.json();

    const { projectId } = await params;

    const token = req.cookies.get('token')?.value;

    const { companyId } = await getCompanyIdFromToken(token);

    if (!companyId) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const folder = await FolderController.getFolder(folderId);

    await FolderController.moveChildrenFoldersUpper(folder!);

    await FolderController.deleteFolder(folderId);

    const allFolders = await FolderController.getProjectFolders(
      Number(projectId)
    );

    return NextResponse.json(allFolders, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to get project ' + e },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const folder = await req.json();

    const { projectId } = await params;

    const validation = createFolderSchema.safeParse(folder);

    if (!validation.success) {
      return generateValidationErrors(validation.error.errors);
    }

    await FolderController.update(folder);

    const allFolders = await FolderController.getProjectFolders(
      Number(projectId)
    );

    return NextResponse.json(allFolders, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
