import { Project } from "@/types/Project";
import { User } from "@/types/User";
import { Folder } from "@prisma/client";
import { create } from "zustand";

export type SelectedProjectState = {
  selectedProject: Project | null;
  projectFolders: Folder[];

  setSelectedProject: (projects: Project) => void;
  setProjectFolders: (projectFolders: Folder[]) => void;

  updateFolder: (folder: Folder) => void;

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

  updateFolder: (updatedFolder: Folder) =>
    set((state: SelectedProjectState) => ({
      projectFolders: state.projectFolders.map((folder: Folder) =>
        folder.id === updatedFolder.id ? updatedFolder : folder
      ),
    })),

  addProjectFolder: (folder: Folder) =>
    set((state: SelectedProjectState) => ({
      projectFolders: [...state.projectFolders, folder],
    })),
}));
