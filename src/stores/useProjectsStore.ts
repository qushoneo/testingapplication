import { Project } from '@/types/Project';
import { create } from 'zustand';

export type ProjectsState = {
  projects: Project[];
  selectedProjects: Project[];

  addProject: (project: Project) => void;
  removeProject: (projectId: number) => void;
  updateProject: (updatedProject: Project) => void;
  setProjects: (projects: Project[]) => void;
  setSelectedProjects: (projects: Project[]) => void;
  selectProject: (project: Project) => void;
  unselectProject: (projectId: number) => void;

  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [],
  selectedProjects: [],
  isLoading: false,

  selectProject: (project: Project) =>
    set((state: ProjectsState) => ({
      selectedProjects: [...state.selectedProjects, project],
    })),

  setSelectedProjects: (selectedProjects: Project[]) =>
    set(() => ({
      selectedProjects,
    })),

  unselectProject: (projectId: number) =>
    set((state: ProjectsState) => ({
      selectedProjects: state.selectedProjects.filter(
        (project) => project.id !== projectId
      ),
    })),

  addProject: (project: Project) =>
    set((state: ProjectsState) => ({
      projects: [...state.projects, project],
    })),

  removeProject: (projectId: number) => {
    let lastProject = null;

    if (typeof window !== 'undefined') {
      lastProject = JSON.parse(
        localStorage.getItem('lastSelectedProject') || 'null'
      );
    }

    if (lastProject?.id === projectId) {
      localStorage.removeItem('lastSelectedProject');
    }

    return set((state: ProjectsState) => ({
      projects: state.projects.filter((project) => project.id !== projectId),
    }));
  },

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

  setIsLoading: (isLoading: boolean) =>
    set(() => ({
      isLoading,
    })),
}));
