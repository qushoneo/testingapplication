import { create } from "zustand";
import { Project } from "@/types/Project";
import { User } from "@/types/User";
import { Folder, TestCase } from "@prisma/client";

export type SelectedProjectState = {
  selectedProject: Project | null;
  projectFolders: Folder[];
  testCases: TestCase[];

  setSelectedProject: (projects: Project) => void;
  setProjectFolders: (projectFolders: Folder[]) => void;
  setTestCases: (testCases: TestCase[]) => void;

  updateFolder: (folder: Folder) => void;
  removeFolder: (folderId: number) => void;
  addProjectFolder: (project: Folder) => void;

  addTestCase: (testCase: TestCase) => void;
  updateTestCase: (updatedTestCase: TestCase) => void;
  removeTestCase: (testCaseId: number) => void;
};

export const useSelectedProjectStore = create<SelectedProjectState>((set) => ({
  selectedProject: null,
  projectFolders: [],
  testCases: [],

  setProjectFolders: (folders: Folder[]) =>
    set(() => ({
      projectFolders: folders,
    })),

  setSelectedProject: (selectedProject: Project) =>
    set(() => ({
      selectedProject,
    })),

  setTestCases: (testCases: TestCase[]) =>
    set(() => ({
      testCases,
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

  removeFolder: (folderId: number) =>
    set((state: SelectedProjectState) => ({
      projectFolders: state.projectFolders.filter(
        (folder) => folder.id !== folderId
      ),
    })),

  addTestCase: (testCase: TestCase) =>
    set((state: SelectedProjectState) => ({
      testCases: [...state.testCases, testCase],
    })),

  updateTestCase: (updatedTestCase: TestCase) =>
    set((state: SelectedProjectState) => ({
      testCases: state.testCases.map((testCase) =>
        testCase.id === updatedTestCase.id ? updatedTestCase : testCase
      ),
    })),

  removeTestCase: (testCaseId: number) =>
    set((state: SelectedProjectState) => ({
      testCases: state.testCases.filter(
        (testCase) => testCase.id !== testCaseId
      ),
    })),
}));
