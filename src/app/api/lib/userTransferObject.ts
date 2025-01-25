import { User } from "@/types/User";
import { Role } from "@prisma/client";

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  jobTitle: string;
  createdAt: Date;
  companyId: number;
  role: Role;
}

export function userToDTO(user: User): UserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    jobTitle: user.jobTitle,
    createdAt: user.createdAt,
    companyId: user.companyId,
    role: user.role,
  };
}
