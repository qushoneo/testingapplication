import { create } from 'zustand';

interface CreateTestPlanStore {
  selectedTestCases: number[];
  setSelectedTestCases: (testCases: number[]) => void;

  selectTestCase: (testCaseId: number) => void;
  unselectTestCase: (testCaseId: number) => void;
}

const useCreateTestPlanStore = create<CreateTestPlanStore>((set) => ({
  selectedTestCases: [],
  setSelectedTestCases: (testCases) => set({ selectedTestCases: testCases }),

  selectTestCase: (testCaseId: number) =>
    set((state) => ({
      selectedTestCases: [...state.selectedTestCases, testCaseId],
    })),

  unselectTestCase: (testCaseId: number) =>
    set((state) => ({
      selectedTestCases: state.selectedTestCases.filter(
        (id) => id !== testCaseId
      ),
    })),
}));

export default useCreateTestPlanStore;
