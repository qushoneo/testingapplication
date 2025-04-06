import { create } from 'zustand';
import { Project } from '@/types/Project';
import { User } from '@/types/User';
import { Folder, TestCase } from '@prisma/client';

export type ProjectStorageState = {
  selectedProject: Project | null;

  setSelectedProject: (projects: Project) => void;
};

export const useProjectStorageStore = create<ProjectStorageState>((set) => ({
  selectedProject: null,
  setSelectedProject: (project: Project) => {
    set({ selectedProject: project });
  },
}));
