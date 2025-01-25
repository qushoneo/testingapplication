export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}
export interface Company {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  jobTitle: string;
  createdAt: Date;
  companyId: number;
  company: Company;
  role: Role;
}
