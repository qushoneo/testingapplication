import { create } from 'zustand';
import { Project } from '@/types/Project';
import { User } from '@/types/User';
import { Folder, TestCase } from '@prisma/client';

export type ProjectStorageState = {
  selectedProject: Project | null;

  setSelectedProject: (projects: Project) => void;
};

const getInitialProject = () => {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('lastSelectedProject') || 'null');
  }

  return null;
};

export const useProjectStorageStore = create<ProjectStorageState>((set) => ({
  selectedProject: getInitialProject(),
  setSelectedProject: (project: Project) => {
    localStorage.setItem('lastSelectedProject', JSON.stringify(project));
    set({ selectedProject: project });
  },
}));
