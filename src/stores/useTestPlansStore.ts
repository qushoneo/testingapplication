import { Folder, Project, TestCase } from '@prisma/client';
import { create } from 'zustand';

type TestPlanState = {
  testPlans: TestPlan[];
  setTestPlans: (testPlans: TestPlan[]) => void;

  selectedProject: Project | null;
  setSelectedProject: (selectedProject: Project | null) => void;
};

export const useTestPlansStore = create<TestPlanState>((set) => ({
  testPlans: [],
  setTestPlans: (testPlans: TestPlan[]) => set({ testPlans }),

  selectedProject: null,
  setSelectedProject: (selectedProject: Project | null) =>
    set({ selectedProject }),
}));
