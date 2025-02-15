import { Folder } from '@prisma/client';
import { create } from 'zustand';

type FolderState = {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;

  updateFolder: (updatedFolder: Folder) => void;
  addProjectFolder: (folder: Folder) => void;
  removeFolder: (folderId: number) => void;

  openedFolderId: number | null;
  setOpenedFolderId: (folderId: number | null) => void;

  isFolderLoading: boolean;
  setIsFolderLoading: (isFolderLoading: boolean) => void;
};

export const useFoldersStore = create<FolderState>((set) => ({
  folders: [],
  setFolders: (folders: Folder[]) => set({ folders }),

  updateFolder: (updatedFolder: Folder) =>
    set((state: FolderState) => ({
      folders: state.folders.map((folder: Folder) =>
        folder.id === updatedFolder.id ? updatedFolder : folder
      ),
    })),

  addProjectFolder: (folder: Folder) =>
    set((state: FolderState) => ({
      folders: [...state.folders, folder],
    })),

  removeFolder: (folderId: number) =>
    set((state: FolderState) => ({
      folders: state.folders.filter((folder) => folder.id !== folderId),
    })),

  openedFolderId: null,
  setOpenedFolderId: (folderId: number | null) =>
    set(() => ({
      openedFolderId: folderId,
    })),

  isFolderLoading: false,
  setIsFolderLoading: (isFolderLoading: boolean) =>
    set(() => ({
      isFolderLoading,
    })),
}));
