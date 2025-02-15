import { create } from 'zustand';

interface ModalStore {
  isCreateProjectOpen: boolean;
  isCreateTestCaseOpen: boolean;
  isCreateFolderOpen: boolean;
  isCreateTestPlanOpen: boolean;

  isEditProjectOpen: boolean;
  isEditTestCaseOpen: boolean;
  isEditFolderOpen: boolean;

  isDeleteProjectOpen: boolean;
  isDeleteTestCaseOpen: boolean;
  isDeleteFolderOpen: boolean;

  selectedFolderId?: number | null;
  selectedProjectId?: number | null;
  selectedTestCaseId?: number | null;

  openCreateProject: () => void;
  closeCreateProject: () => void;

  openCreateTestCase: (parentFolderId?: number | null) => void;
  closeCreateTestCase: () => void;

  openCreateFolder: (parentFolderId?: number | null) => void;
  closeCreateFolder: () => void;

  openCreateTestPlan: () => void;
  closeCreateTestPlan: () => void;

  openEditProject: (projectId: number) => void;
  closeEditProject: () => void;

  openEditTestCase: (testCaseId: number) => void;
  closeEditTestCase: () => void;

  openEditFolder: (folderId: number) => void;
  closeEditFolder: () => void;

  openDeleteProject: (projectId: number) => void;
  closeDeleteProject: () => void;

  openDeleteTestCase: (testCaseId: number) => void;
  closeDeleteTestCase: () => void;

  openDeleteFolder: (folderId: number) => void;
  closeDeleteFolder: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isCreateProjectOpen: false,
  isCreateTestCaseOpen: false,
  isCreateFolderOpen: false,
  isCreateTestPlanOpen: false,
  isEditProjectOpen: false,
  isEditTestCaseOpen: false,
  isEditFolderOpen: false,

  isDeleteProjectOpen: false,
  isDeleteTestCaseOpen: false,
  isDeleteFolderOpen: false,

  selectedFolderId: null,
  selectedProjectId: null,
  selectedTestCaseId: null,

  openCreateProject: () => set({ isCreateProjectOpen: true }),
  closeCreateProject: () => set({ isCreateProjectOpen: false }),

  openCreateTestPlan: () => set({ isCreateTestPlanOpen: true }),
  closeCreateTestPlan: () => set({ isCreateTestPlanOpen: false }),

  openCreateTestCase: (parentFolderId?: number | null) =>
    set({ selectedFolderId: parentFolderId, isCreateTestCaseOpen: true }),
  closeCreateTestCase: () =>
    set({ isCreateTestCaseOpen: false, selectedFolderId: null }),

  openCreateFolder: (parentFolderId?: number | null) =>
    set({
      selectedFolderId: parentFolderId,
      isCreateFolderOpen: true,
    }),
  closeCreateFolder: () =>
    set({ isCreateFolderOpen: false, selectedFolderId: null }),

  openEditProject: (projectId: number) =>
    set({
      selectedProjectId: projectId,
      isEditProjectOpen: true,
    }),
  closeEditProject: () =>
    set({ isEditProjectOpen: false, selectedProjectId: null }),

  openEditTestCase: (testCaseId: number) =>
    set({
      selectedTestCaseId: testCaseId,
      isEditTestCaseOpen: true,
    }),
  closeEditTestCase: () =>
    set({ isEditTestCaseOpen: false, selectedTestCaseId: null }),

  openEditFolder: (folderId: number) =>
    set({
      selectedFolderId: folderId,
      isEditFolderOpen: true,
    }),
  closeEditFolder: () =>
    set({ isEditFolderOpen: false, selectedFolderId: null }),

  openDeleteProject: (projectId: number) =>
    set({
      selectedProjectId: projectId,
      isDeleteProjectOpen: true,
    }),
  closeDeleteProject: () =>
    set({ isDeleteProjectOpen: false, selectedProjectId: null }),

  openDeleteTestCase: (testCaseId: number) =>
    set({
      selectedTestCaseId: testCaseId,
      isDeleteTestCaseOpen: true,
    }),
  closeDeleteTestCase: () =>
    set({ isDeleteTestCaseOpen: false, selectedTestCaseId: null }),

  openDeleteFolder: (folderId: number) =>
    set({
      selectedFolderId: folderId,
      isDeleteFolderOpen: true,
    }),
  closeDeleteFolder: () =>
    set({ isDeleteFolderOpen: false, selectedFolderId: null }),
}));
