import { User } from '@prisma/client';
import { Project as ProjectType } from '@prisma/client';

export type Project = ProjectType & { users: User[] };
