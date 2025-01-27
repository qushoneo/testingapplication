import { User } from "@/types/User";
import { Company, Folder } from "@prisma/client";

export interface Project {
  id: number;
  name: string;
  createdAt: string;
  companyId: number;
  members: User[];
  folders: Folder[];
}
