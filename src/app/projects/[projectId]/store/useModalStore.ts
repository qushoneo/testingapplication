import { create } from "zustand";

interface ModalStore {
  isCreateProjectOpen: boolean;
  isCreateTestCaseOpen: boolean;
  isCreateFolderOpen: boolean;

  isEditProjectOpen: boolean;
  isEditTestCaseOpen: boolean;
  isEditFolderOpen: boolean;

  isDeleteProjectOpen: boolean;
  isDeleteTestCaseOpen: boolean;
  isDeleteFolderOpen: boolean;

  selectedFolderId?: number | undefined;
  selectedProjectId?: number | undefined;
  selectedTestCaseId?: number | undefined;

  openCreateProject: () => void;
  closeCreateProject: () => void;

  openCreateTestCase: () => void;
  closeCreateTestCase: () => void;

  openCreateFolder: (parentFolderId?: number | undefined) => void;
  closeCreateFolder: () => void;

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

  isEditProjectOpen: false,
  isEditTestCaseOpen: false,
  isEditFolderOpen: false,

  isDeleteProjectOpen: false,
  isDeleteTestCaseOpen: false,
  isDeleteFolderOpen: false,

  selectedFolderId: undefined,
  selectedProjectId: undefined,
  selectedTestCaseId: undefined,

  openCreateProject: () => set({ isCreateProjectOpen: true }),
  closeCreateProject: () => set({ isCreateProjectOpen: false }),

  openCreateTestCase: () => set({ isCreateTestCaseOpen: true }),
  closeCreateTestCase: () => set({ isCreateTestCaseOpen: false }),

  openCreateFolder: (parentFolderId?: number | undefined) =>
    set({
      selectedFolderId: parentFolderId,
      isCreateFolderOpen: true,
    }),
  closeCreateFolder: () =>
    set({ isCreateFolderOpen: false, selectedFolderId: undefined }),

  openEditProject: (projectId: number) =>
    set({
      selectedProjectId: projectId,
      isEditProjectOpen: true,
    }),
  closeEditProject: () =>
    set({ isEditProjectOpen: false, selectedProjectId: undefined }),

  openEditTestCase: (testCaseId: number) =>
    set({
      selectedTestCaseId: testCaseId,
      isEditTestCaseOpen: true,
    }),
  closeEditTestCase: () =>
    set({ isEditTestCaseOpen: false, selectedTestCaseId: undefined }),

  openEditFolder: (folderId: number) =>
    set({
      selectedFolderId: folderId,
      isEditFolderOpen: true,
    }),
  closeEditFolder: () =>
    set({ isEditFolderOpen: false, selectedFolderId: undefined }),

  openDeleteProject: (projectId: number) =>
    set({
      selectedProjectId: projectId,
      isDeleteProjectOpen: true,
    }),
  closeDeleteProject: () =>
    set({ isDeleteProjectOpen: false, selectedProjectId: undefined }),

  openDeleteTestCase: (testCaseId: number) =>
    set({
      selectedTestCaseId: testCaseId,
      isDeleteTestCaseOpen: true,
    }),
  closeDeleteTestCase: () =>
    set({ isDeleteTestCaseOpen: false, selectedTestCaseId: undefined }),

  openDeleteFolder: (folderId: number) =>
    set({
      selectedFolderId: folderId,
      isDeleteFolderOpen: true,
    }),
  closeDeleteFolder: () =>
    set({ isDeleteFolderOpen: false, selectedFolderId: undefined }),
}));
