import { Role } from "@prisma/client";

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  jobTitle: string;
  createdAt: Date;
  companyId: number;
  role: Role;
};
