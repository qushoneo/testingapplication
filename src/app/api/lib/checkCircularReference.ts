import { prisma } from "./prisma";

export default async function hasCircularReference(
  folderId: number,
  parentId: number | null
): Promise<boolean> {
  if (!parentId) return false;

  let currentParentId = parentId;

  while (currentParentId) {
    if (currentParentId === folderId) {
      return true;
    }

    const parentFolder = await prisma.folder.findUnique({
      where: { id: currentParentId },
      select: { parentId: true },
    });

    //@ts-ignore
    currentParentId = parentFolder?.parentId || null;
  }

  return false;
}
