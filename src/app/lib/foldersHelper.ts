import { Folder } from "@/types/Folder";
import { TestCase } from "@prisma/client";

export const foldersWithTestCases = (
  testCases: TestCase[],
  folders: Folder[]
) => {
  const foldersIds = Array.from(
    new Set(testCases.map((testCase: TestCase) => testCase.folderId))
  );

  return foldersIds
    .map((folderId: number) => {
      return folders.find((folder: Folder) => folderId === folder.id);
    })
    .filter((folder): folder is Folder => folder !== undefined);
};
