import { User } from "@/types/User";
import { Company, Defect, Folder } from "@prisma/client";

export interface Project {
  id: number;
  name: string;
  createdAt: string;
  companyId: number;
  defects: Defect[];
  members: User[];
  folders: Folder[];
}
