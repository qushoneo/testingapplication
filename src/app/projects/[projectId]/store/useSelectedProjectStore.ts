import { Project } from "@/types/Project";
import { User } from "@/types/User";
import { Folder } from "@prisma/client";
import { create } from "zustand";

export type SelectedProjectState = {
  selectedProject: Project | null;
  setSelectedProject: (projects: Project) => void;

  projectFolders: Folder[];
  setProjectFolders: (projectFolders: Folder[]) => void;

  addProjectFolder: (project: Folder) => void;
};

export const useSelectedProjectStore = create<SelectedProjectState>((set) => ({
  selectedProject: null,

  projectFolders: [],

  setProjectFolders: (folders: Folder[]) =>
    set(() => ({
      projectFolders: folders,
    })),

  setSelectedProject: (selectedProject: Project) =>
    set(() => ({
      selectedProject,
    })),

  addProjectFolder: (folder: Folder) =>
    set((state: SelectedProjectState) => ({
      projectFolders: [...state.projectFolders, folder],
    })),
}));
