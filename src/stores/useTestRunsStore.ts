import { TestRun } from '@/types/TestRun';
import { create } from 'zustand';

type TestRunState = {
  testRuns: TestRun[];
  setTestRuns: (testRuns: TestRun[]) => void;
};

export const useTestRunsStore = create<TestRunState>((set) => ({
  testRuns: [],
  setTestRuns: (testRuns: TestRun[]) => set({ testRuns }),
}));
