import { create } from "zustand";
import { TestCaseRun } from "@/types/TestCaseRun";

export type SelectedTestCaseRunStore = {
  selectedTestCaseRun: TestCaseRun | null;
  setSelectedTestCaseRun: (testRun: TestCaseRun | null) => void;
};

export const useSelectedTestCaseRun = create<SelectedTestCaseRunStore>(
  (set) => ({
    selectedTestCaseRun: null,
    setSelectedTestCaseRun: (testCaseRun: TestCaseRun) =>
      set({ selectedTestCaseRun: testCaseRun }),
  })
);
