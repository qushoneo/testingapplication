import { TestCase } from '@prisma/client';
import { create } from 'zustand';

type TestCasesState = {
  testCases: TestCase[];
  setTestCases: (testCases: TestCase[]) => void;
  selectedTestCases: TestCase[];

  addTestCase: (testCase: TestCase) => void;
  addTestCases: (testCasesArray: TestCase[]) => void;
  updateTestCase: (updatedTestCase: TestCase) => void;
  removeTestCase: (testCaseId: number) => void;
  removeTestCases: (testCasesToRemove: TestCase[]) => void;
  selectTestCase: (testCase: TestCase) => void;
  unselectTestCase: (testCaseId: number) => void;
  selectProjectTestCases: (projectId: number) => void;
  selectFolderTestCases: (folderID: number) => void;
  isTestCaseSelected: (testCaseId: number) => boolean;
  isTestCaseLoading: boolean;
  setIsTestCaseLoading: (isTestCaseLoading: boolean) => void;
};

export const useTestCasesStore = create<TestCasesState>((set, get) => ({
  testCases: [],
  selectedTestCases: [],
  isTestCaseLoading: false,

  setTestCases: (testCases: TestCase[]) => set({ testCases }),

  setIsTestCaseLoading: (isTestCaseLoading: boolean) =>
    set({ isTestCaseLoading }),

  addTestCase: (testCase: TestCase) =>
    set((state) => ({
      testCases: [...state.testCases, testCase],
    })),

  addTestCases: (testCasesArray: TestCase[]) =>
    set((state) => ({
      testCases: [...state.testCases, ...testCasesArray],
    })),

  updateTestCase: (updatedTestCase: TestCase) =>
    set((state) => ({
      testCases: state.testCases.map((testCase) =>
        testCase.id === updatedTestCase.id ? updatedTestCase : testCase
      ),
    })),

  removeTestCase: (testCaseId: number) =>
    set((state) => ({
      testCases: state.testCases.filter(
        (testCase) => testCase.id !== testCaseId
      ),
    })),

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

  selectTestCase: (testCase: TestCase) =>
    set((state) => ({
      selectedTestCases: [...state.selectedTestCases, testCase],
    })),

  unselectTestCase: (testCaseId: number) =>
    set((state) => ({
      selectedTestCases: state.selectedTestCases.filter(
        (testCase) => testCase.id !== testCaseId
      ),
    })),

  selectProjectTestCases: (projectId: number) =>
    set((state) => ({
      selectedTestCases: [
        ...state.selectedTestCases,
        ...state.testCases.filter(
          (testCase) => testCase.folderId === projectId
        ),
      ],
    })),

  isTestCaseSelected: (testCaseId: number) => {
    return get().selectedTestCases.some(
      (testCase: TestCase) => testCase.id === testCaseId
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
}));
