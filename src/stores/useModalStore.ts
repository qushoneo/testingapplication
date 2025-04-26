import { create } from 'zustand';

interface ModalStore {
  // Project modals
  isCreateProjectOpen: boolean;
  isEditProjectOpen: boolean;
  isDeleteProjectOpen: boolean;
  selectedProjectId?: number | null;
  openCreateProject: () => void;
  closeCreateProject: () => void;
  openEditProject: (projectId: number) => void;
  closeEditProject: () => void;
  openDeleteProject: (projectId: number) => void;
  closeDeleteProject: () => void;

  // Test case modals
  isCreateTestCaseOpen: boolean;
  isEditTestCaseOpen: boolean;
  isDeleteTestCaseOpen: boolean;
  selectedTestCaseId?: number | null;
  openCreateTestCase: (parentFolderId?: number | null) => void;
  closeCreateTestCase: () => void;
  openEditTestCase: (testCaseId: number) => void;
  closeEditTestCase: () => void;
  openDeleteTestCase: (testCaseId: number) => void;
  closeDeleteTestCase: () => void;

  // Folder modals
  isCreateFolderOpen: boolean;
  isEditFolderOpen: boolean;
  isDeleteFolderOpen: boolean;
  selectedFolderId?: number | null;
  openCreateFolder: (parentFolderId?: number | null) => void;
  closeCreateFolder: () => void;
  openEditFolder: (folderId: number) => void;
  closeEditFolder: () => void;
  openDeleteFolder: (folderId: number) => void;
  closeDeleteFolder: () => void;

  // Test plan modals
  isCreateTestPlanOpen: boolean;
  isEditTestPlanOpen: boolean;
  isSelectTestCasesOpen: boolean;
  selectedTestPlanId?: number | null;
  openCreateTestPlan: () => void;
  closeCreateTestPlan: () => void;
  openSelectTestCases: () => void;
  closeSelectTestCases: () => void;
  openEditTestPlan: (testPlanId: number) => void;
  closeEditTestPlan: () => void;

  // Test run modals
  isCreateTestRunOpen: boolean;
  openCreateTestRun: () => void;
  closeCreateTestRun: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  // Project modals
  isCreateProjectOpen: false,
  isEditProjectOpen: false,
  isDeleteProjectOpen: false,
  selectedProjectId: null,
  openCreateProject: () => set({ isCreateProjectOpen: true }),
  closeCreateProject: () => set({ isCreateProjectOpen: false }),
  openEditProject: (projectId: number) =>
    set({
      selectedProjectId: projectId,
      isEditProjectOpen: true,
    }),
  closeEditProject: () =>
    set({ isEditProjectOpen: false, selectedProjectId: null }),
  openDeleteProject: (projectId: number) =>
    set({
      selectedProjectId: projectId,
      isDeleteProjectOpen: true,
    }),
  closeDeleteProject: () =>
    set({ isDeleteProjectOpen: false, selectedProjectId: null }),

  // Test case modals
  isCreateTestCaseOpen: false,
  isEditTestCaseOpen: false,
  isDeleteTestCaseOpen: false,
  selectedTestCaseId: null,
  openCreateTestCase: (parentFolderId?: number | null) =>
    set({ selectedFolderId: parentFolderId, isCreateTestCaseOpen: true }),
  closeCreateTestCase: () =>
    set({ isCreateTestCaseOpen: false, selectedFolderId: null }),
  openEditTestCase: (testCaseId: number) =>
    set({
      selectedTestCaseId: testCaseId,
      isEditTestCaseOpen: true,
    }),
  closeEditTestCase: () =>
    set({ isEditTestCaseOpen: false, selectedTestCaseId: null }),
  openDeleteTestCase: (testCaseId: number) =>
    set({
      selectedTestCaseId: testCaseId,
      isDeleteTestCaseOpen: true,
    }),
  closeDeleteTestCase: () =>
    set({ isDeleteTestCaseOpen: false, selectedTestCaseId: null }),

  // Folder modals
  isCreateFolderOpen: false,
  isEditFolderOpen: false,
  isDeleteFolderOpen: false,
  selectedFolderId: null,
  openCreateFolder: (parentFolderId?: number | null) =>
    set({
      selectedFolderId: parentFolderId,
      isCreateFolderOpen: true,
    }),
  closeCreateFolder: () =>
    set({ isCreateFolderOpen: false, selectedFolderId: null }),
  openEditFolder: (folderId: number) =>
    set({
      selectedFolderId: folderId,
      isEditFolderOpen: true,
    }),
  closeEditFolder: () =>
    set({ isEditFolderOpen: false, selectedFolderId: null }),
  openDeleteFolder: (folderId: number) =>
    set({
      selectedFolderId: folderId,
      isDeleteFolderOpen: true,
    }),
  closeDeleteFolder: () =>
    set({ isDeleteFolderOpen: false, selectedFolderId: null }),

  // Test plan modals
  isCreateTestPlanOpen: false,
  isEditTestPlanOpen: false,
  isSelectTestCasesOpen: false,
  selectedTestPlanId: null,
  openCreateTestPlan: () => set({ isCreateTestPlanOpen: true }),
  closeCreateTestPlan: () => set({ isCreateTestPlanOpen: false }),
  openSelectTestCases: () => set({ isSelectTestCasesOpen: true }),
  closeSelectTestCases: () => set({ isSelectTestCasesOpen: false }),
  openEditTestPlan: (testPlanId: number) =>
    set({
      selectedTestPlanId: testPlanId,
      isEditTestPlanOpen: true,
    }),
  closeEditTestPlan: () =>
    set({ isEditTestPlanOpen: false, selectedTestPlanId: null }),

  // Test run modals
  isCreateTestRunOpen: false,
  openCreateTestRun: () => set({ isCreateTestRunOpen: true }),
  closeCreateTestRun: () => set({ isCreateTestRunOpen: false }),
}));
