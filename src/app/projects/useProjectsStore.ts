import { User } from "@/types/User";
import { create } from "zustand";

type Project = {
  id: number;
  name: string;
  defects: [];
  members: User[];
};

export type ProjectsState = {
  projects: Project[];

  addProject: (project: Project) => void;
  removeProject: (projectId: number) => void;
  updateProject: (updatedProject: Project) => void;
  setProjects: (projects: Project[]) => void;
};

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [
    {
      id: 1,
      name: "Teambook",
      defects: [],
      members: [
        { id: 3, name: "Zane Baker" },
        { id: 4, name: "Chris Allen" },
        { id: 5, name: "John Doe" },
        { id: 6, name: "Yvonne Harris" },
        { id: 7, name: "Laura King" },
      ],
    },
    {
      id: 2,
      name: "Project Alpha",
      defects: ["s"],
      members: [
        { id: 8, name: "Uma Roberts" },
        { id: 9, name: "Holly Stevens" },
        { id: 10, name: "Daisy Evans" },
        { id: 11, name: "Rita Martinez" },
        { id: 12, name: "Chris Allen" },
      ],
    },
    {
      id: 3,
      name: "Project Beta",
      defects: [" gg"],
      members: [
        { id: 13, name: "Lily Wright" },
        { id: 14, name: "Walter Walker" },
        { id: 15, name: "Quincy Allen" },
        { id: 16, name: "Zane Baker" },
        { id: 17, name: "Chris Allen" },
      ],
    },
    {
      id: 4,
      name: "Project Gamma",
      defects: [],
      members: [
        { id: 18, name: "John Doe" },
        { id: 19, name: "Yvonne Harris" },
        { id: 20, name: "Uma Roberts" },
        { id: 21, name: "Holly Stevens" },
        { id: 22, name: "Daisy Evans" },
      ],
    },
    {
      id: 5,
      name: "Project Delta",
      defects: [],
      members: [
        { id: 23, name: "Rita Martinez" },
        { id: 24, name: "Chris Allen" },
        { id: 25, name: "Lily Wright" },
        { id: 26, name: "Walter Walker" },
      ],
    },
    {
      id: 6,
      name: "Project Epsilon",
      defects: [],
      members: [
        { id: 27, name: "Quincy Allen" },
        { id: 28, name: "Zane Baker" },
        { id: 29, name: "Chris Allen" },
        { id: 30, name: "John Doe" },
        { id: 31, name: "Yvonne Harris" },
      ],
    },
    {
      id: 7,
      name: "Project Zeta",
      defects: ["sds"],
      members: [
        { id: 32, name: "Laura King" },
        { id: 33, name: "Uma Roberts" },
        { id: 34, name: "Holly Stevens" },
        { id: 35, name: "Daisy Evans" },
      ],
    },
    {
      id: 8,
      name: "Project Eta",
      defects: [],
      members: [
        { id: 36, name: "Rita Martinez" },
        { id: 37, name: "Chris Allen" },
        { id: 38, name: "Lily Wright" },
        { id: 39, name: "Walter Walker" },
        { id: 40, name: "Quincy Allen" },
      ],
    },
    {
      id: 9,
      name: "Project Theta",
      defects: [],
      members: [
        { id: 41, name: "Zane Baker" },
        { id: 42, name: "John Doe" },
        { id: 43, name: "Yvonne Harris" },
        { id: 44, name: "Uma Roberts" },
        { id: 45, name: "Holly Stevens" },
      ],
    },
    {
      id: 10,
      name: "Project Iota",
      defects: [],
      members: [
        { id: 46, name: "Daisy Evans" },
        { id: 47, name: "Rita Martinez" },
        { id: 48, name: "Chris Allen" },
        { id: 49, name: "Lily Wright" },
        { id: 50, name: "Walter Walker" },
      ],
    },
    {
      id: 11,
      name: "Project Kappa",
      defects: ["DSsqqwe"],
      members: [
        { id: 51, name: "Quincy Allen" },
        { id: 52, name: "Zane Baker" },
        { id: 53, name: "Chris Allen" },
        { id: 54, name: "John Doe" },
        { id: 55, name: "Yvonne Harris" },
      ],
    },
    {
      id: 12,
      name: "Project Lambda",
      defects: [],
      members: [
        { id: 56, name: "Uma Roberts" },
        { id: 57, name: "Holly Stevens" },
        { id: 58, name: "Daisy Evans" },
        { id: 59, name: "Rita Martinez" },
      ],
    },
    {
      id: 13,
      name: "Project Mu",
      defects: [],
      members: [
        { id: 60, name: "Chris Allen" },
        { id: 61, name: "Lily Wright" },
        { id: 62, name: "Walter Walker" },
        { id: 63, name: "Quincy Allen" },
        { id: 64, name: "Zane Baker" },
      ],
    },
    {
      id: 14,
      name: "Project Nu",
      defects: [],
      members: [
        { id: 65, name: "John Doe" },
        { id: 66, name: "Yvonne Harris" },
        { id: 67, name: "Uma Roberts" },
        { id: 68, name: "Holly Stevens" },
        { id: 69, name: "Daisy Evans" },
      ],
    },
    {
      id: 15,
      name: "Project Xi",
      defects: [],
      members: [
        { id: 70, name: "Rita Martinez" },
        { id: 71, name: "Chris Allen" },
        { id: 72, name: "Lily Wright" },
        { id: 73, name: "Walter Walker" },
        { id: 74, name: "Quincy Allen" },
      ],
    },
    {
      id: 16,
      name: "Project Omicron",
      defects: [],
      members: [
        { id: 75, name: "Zane Baker" },
        { id: 76, name: "Chris Allen" },
        { id: 77, name: "John Doe" },
        { id: 78, name: "Yvonne Harris" },
        { id: 79, name: "Laura King" },
      ],
    },
    {
      id: 17,
      name: "Project Pi",
      defects: [],
      members: [
        { id: 80, name: "Uma Roberts" },
        { id: 81, name: "Holly Stevens" },
        { id: 82, name: "Daisy Evans" },
        { id: 83, name: "Rita Martinez" },
        { id: 84, name: "Chris Allen" },
      ],
    },
    {
      id: 18,
      name: "Project Rho",
      defects: [],
      members: [
        { id: 85, name: "Lily Wright" },
        { id: 86, name: "Walter Walker" },
        { id: 87, name: "Quincy Allen" },
        { id: 88, name: "Zane Baker" },
        { id: 89, name: "Chris Allen" },
      ],
    },
    {
      id: 19,
      name: "Project Sigma",
      defects: [],
      members: [
        { id: 90, name: "John Doe" },
        { id: 91, name: "Yvonne Harris" },
        { id: 92, name: "Uma Roberts" },
        { id: 93, name: "Holly Stevens" },
        { id: 94, name: "Daisy Evans" },
      ],
    },
    {
      id: 20,
      name: "Project Tau",
      defects: [],
      members: [
        { id: 95, name: "Rita Martinez" },
        { id: 96, name: "Chris Allen" },
        { id: 97, name: "Lily Wright" },
        { id: 98, name: "Walter Walker" },
        { id: 99, name: "Quincy Allen" },
      ],
    },
    {
      id: 21,
      name: "Project Upsilon",
      defects: ["qwewq"],
      members: [
        { id: 100, name: "Zane Baker" },
        { id: 101, name: "Laura King" },
        { id: 102, name: "Chris Allen" },
        { id: 103, name: "John Doe" },
        { id: 104, name: "Yvonne Harris" },
      ],
    },
    {
      id: 22,
      name: "Project Phi",
      defects: [],
      members: [
        { id: 105, name: "Uma Roberts" },
        { id: 106, name: "Holly Stevens" },
        { id: 107, name: "Daisy Evans" },
        { id: 108, name: "Rita Martinez" },
        { id: 109, name: "Chris Allen" },
      ],
    },
    {
      id: 23,
      name: "Project Chi",
      defects: [],
      members: [
        { id: 110, name: "Lily Wright" },
        { id: 111, name: "Walter Walker" },
        { id: 112, name: "Quincy Allen" },
        { id: 113, name: "Zane Baker" },
        { id: 114, name: "Chris Allen" },
      ],
    },
    {
      id: 24,
      name: "Project Psi",
      defects: [],
      members: [
        { id: 115, name: "John Doe" },
        { id: 116, name: "Yvonne Harris" },
        { id: 117, name: "Uma Roberts" },
        { id: 118, name: "Holly Stevens" },
        { id: 119, name: "Daisy Evans" },
      ],
    },
    {
      id: 25,
      name: "Project Omega",
      defects: [],
      members: [
        { id: 120, name: "Rita Martinez" },
        { id: 121, name: "Chris Allen" },
        { id: 122, name: "Lily Wright" },
        { id: 123, name: "Walter Walker" },
        { id: 124, name: "Quincy Allen" },
      ],
    },
    {
      id: 26,
      name: "Project Alpha-2",
      defects: ["sdq"],
      members: [
        { id: 125, name: "Zane Baker" },
        { id: 126, name: "Laura King" },
        { id: 127, name: "Chris Allen" },
        { id: 128, name: "John Doe" },
        { id: 129, name: "Yvonne Harris" },
      ],
    },
    {
      id: 27,
      name: "Project Beta-2",
      defects: [],
      members: [
        { id: 130, name: "Uma Roberts" },
        { id: 131, name: "Holly Stevens" },
        { id: 132, name: "Daisy Evans" },
        { id: 133, name: "Rita Martinez" },
        { id: 134, name: "Chris Allen" },
      ],
    },
    {
      id: 28,
      name: "Project Gamma-2",
      defects: [],
      members: [
        { id: 135, name: "Lily Wright" },
        { id: 136, name: "Walter Walker" },
        { id: 137, name: "Quincy Allen" },
        { id: 138, name: "Zane Baker" },
        { id: 139, name: "Chris Allen" },
      ],
    },
    {
      id: 29,
      name: "Project Delta-2",
      defects: [],
      members: [
        { id: 140, name: "John Doe" },
        { id: 141, name: "Yvonne Harris" },
        { id: 142, name: "Uma Roberts" },
        { id: 143, name: "Holly Stevens" },
        { id: 144, name: "Daisy Evans" },
      ],
    },
    {
      id: 30,
      name: "Project Epsilon-2",
      defects: [],
      members: [
        { id: 145, name: "Rita Martinez" },
        { id: 146, name: "Chris Allen" },
        { id: 147, name: "Lily Wright" },
        { id: 148, name: "Walter Walker" },
        { id: 149, name: "Quincy Allen" },
      ],
    },
  ],

  addProject: (project: Project) =>
    set((state: ProjectsState) => ({
      projects: [...state.projects, project],
    })),

  removeProject: (projectId: number) =>
    set((state: ProjectsState) => ({
      projects: state.projects.filter((project) => project.id !== projectId),
    })),

  updateProject: (updatedProject: Project) =>
    set((state: ProjectsState) => ({
      projects: state.projects.map((project: Project) =>
        project.id === updatedProject.id ? updatedProject : project
      ),
    })),

  setProjects: (projects: Project[]) =>
    set(() => ({
      projects,
    })),
}));
