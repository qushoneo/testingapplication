import { User } from "./User";

export interface Project {
  id: number;
  name: string;
  defects: [];
  members: User[];
}
