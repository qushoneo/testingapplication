import { Folder as FolderType } from '@prisma/client';

export type Folder = FolderType & { children: Folder[] };
