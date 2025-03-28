import { create } from 'zustand';
import { TestCase } from '@prisma/client';
interface SelectedTestCasesStore {
  selectedTestCases: TestCase[];
  setSelectedTestCases: (testCases: TestCase[]) => void;

  selectTestCase: (testCase: TestCase) => void;
  unselectTestCase: (testCaseId: number) => void;
  isTestCaseSelected: (testCaseId: number) => boolean;

  multipleSelectTestCase: (testCases: TestCase[]) => void;

  multipleUnselectTestCase: (testCaseIds: number[]) => void;
}

const useSelectedTestCasesStore = create<SelectedTestCasesStore>(
  (set, get) => ({
    selectedTestCases: [],
    setSelectedTestCases: (testCases) => set({ selectedTestCases: testCases }),

    isTestCaseSelected: (testCaseId: number) =>
      get().selectedTestCases.some((testCase) => testCase.id === testCaseId),

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

    multipleSelectTestCase: (testCases: TestCase[]) =>
      set((state) => ({
        selectedTestCases: [...state.selectedTestCases, ...testCases],
      })),

    multipleUnselectTestCase: (testCaseIds: number[]) =>
      set((state) => ({
        selectedTestCases: state.selectedTestCases.filter(
          (testCase) => !testCaseIds.includes(testCase.id)
        ),
      })),
  })
);

export default useSelectedTestCasesStore;
