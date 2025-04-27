import { Folder, Project } from '@prisma/client';
import { prisma } from '../lib/prisma';

class FolderController {
  async getProjectFolders(projectId: Project['id']): Promise<Folder[]> {
    const folders = await prisma.folder.findMany({
      where: {
        projectId: Number(projectId),
      },
      include: {
        children: true,
      },
    });

    return folders;
  }

  async getFolder(folderId: Folder['id']): Promise<Folder | null> {
    const folder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
    });

    return folder;
  }

  async createFolder(
    name: string,
    companyId: number | string,
    projectId: number | string,
    parentId: number | null
  ) {
    console.log({
      name: name,
      parentId: parentId,
      projectId: Number(projectId),
      companyId: Number(companyId),
    });

    const createdFolder = await prisma.folder.create({
      data: {
        name: name,
        parentId: parentId,
        projectId: Number(projectId),
        companyId: Number(companyId),
      },
      include: {
        children: true,
      },
    });

    return createdFolder;
  }

  async deleteFolder(folderId: number) {
    const deletedFolder = await prisma.folder.delete({
      where: {
        id: folderId,
      },
    });

    return deletedFolder;
  }

  async moveChildrenFoldersUpper(folder: Folder) {
    const childrenFolders = await prisma.folder.findMany({
      where: {
        parentId: Number(folder.id),
      },
    });

    childrenFolders.forEach(async (children_folder) => {
      await prisma.folder.update({
        where: {
          id: children_folder.id,
        },
        data: {
          parentId: folder?.parentId,
        },
      });
    });
  }

  async update(folder: Pick<Folder, 'id' | 'name' | 'parentId'>) {
    const newFolder = await prisma.folder
      .update({
        where: { id: folder.id },
        data: {
          ...folder,
        },
      })
      .catch((e) => console.log(e));

    return newFolder;
  }
}

export default new FolderController();
