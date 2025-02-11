import { create } from 'zustand';
import { Project } from '@/types/Project';
import { User } from '@/types/User';
import { Folder, TestCase } from '@prisma/client';

export type SelectedProjectState = {
  selectedProject: Project | null;
  projectFolders: Folder[];
  testCases: TestCase[];
  selectedTestCases: TestCase[];

  setSelectedProject: (projects: Project) => void;
  setProjectFolders: (projectFolders: Folder[]) => void;
  setTestCases: (testCases: TestCase[]) => void;

  updateFolder: (folder: Folder) => void;
  removeFolder: (folderId: number) => void;
  addProjectFolder: (project: Folder) => void;

  addTestCase: (testCase: TestCase) => void;
  addTestCases: (testCasesArray: TestCase[]) => void;
  updateTestCase: (updatedTestCase: TestCase) => void;
  removeTestCase: (testCaseId: number) => void;
  removeTestCases: (testCasesToRemove: TestCase[]) => void;
  selectTestCase: (testCase: TestCase) => void;
  unselectTestCase: (testCaseId: number) => void;
  selectProjectTestCases: (projectId: number) => void;
  selectFolderTestCases: (folderID: number) => void;
  isTestCaseSelected: (testCaseId: number) => void;
};

export const useSelectedProjectStore = create<SelectedProjectState>(
  (set, get) => ({
    selectedProject: null,
    projectFolders: [],
    testCases: [],
    selectedTestCases: [],

    isTestCaseSelected: (testCaseId: number) => {
      return get().selectedTestCases.some(
        (testCase) => testCase.id === testCaseId
      );
    },

    selectFolderTestCases: (folderId: number) => {
      set((state) => {
        const folderTestCases = state.testCases.filter(
          (testCase) => testCase.folderId === folderId
        );
        const selectedIds = new Set(state.selectedTestCases.map((tc) => tc.id));

        const allSelected = folderTestCases.every((testCase) =>
          selectedIds.has(testCase.id)
        );

        const newSelectedTestCases = allSelected
          ? state.selectedTestCases.filter(
              (testCase) => testCase.folderId !== folderId
            )
          : [
              ...state.selectedTestCases,
              ...folderTestCases.filter(
                (testCase) => !selectedIds.has(testCase.id)
              ),
            ];

        return { selectedTestCases: newSelectedTestCases };
      });
    },

    removeTestCases: (testCasesToRemove: TestCase[]) => {
      set((state) => {
        const removeIds = new Set(testCasesToRemove.map((tc) => tc.id));

        return {
          testCases: state.testCases.filter(
            (testCase) => !removeIds.has(testCase.id)
          ),
          selectedTestCases: state.selectedTestCases.filter(
            (testCase) => !removeIds.has(testCase.id)
          ),
        };
      });
    },

    selectProjectTestCases: (projectId: number) =>
      set((state: SelectedProjectState) => ({
        selectedTestCases: [
          ...state.selectedTestCases,
          ...state.testCases.filter(
            (testCase) => testCase.folderId === projectId
          ),
        ],
      })),

    selectTestCase: (testCase: TestCase) =>
      set((state: SelectedProjectState) => ({
        selectedTestCases: [...state.selectedTestCases, testCase],
      })),

    setSelectedTestCase: (selectedTestCases: TestCase[]) =>
      set(() => ({
        selectedTestCases,
      })),

    unselectTestCase: (testCaseId: number) =>
      set((state: SelectedProjectState) => ({
        selectedTestCases: state.selectedTestCases.filter(
          (testCase) => testCase.id !== testCaseId
        ),
      })),

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

    addTestCases: (testCasesArray: TestCase[]) =>
      set((state: SelectedProjectState) => ({
        testCases: [...state.testCases, ...testCasesArray],
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
  })
);
