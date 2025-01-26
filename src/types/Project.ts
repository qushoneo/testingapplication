import { User } from "@/types/User";

export interface Project {
  id: number;
  name: string;
  defects: [];
  members: User[];
}
