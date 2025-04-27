'use client';

import axios from 'axios';
import { fetcher } from '../lib/fetcher';
import { mutate } from 'swr';
import { Folder } from '@prisma/client';

const folderRequests = {
  getFoldersByProjectId: async (projectId: number | string) => {
    return await fetcher(`/api/projects/${projectId}/folders`);
  },

  createFolder: async (
    projectId: number,
    name: string,
    parentId: number | null
  ) => {
    return fetcher(`/api/projects/${projectId}/folders`, {
      method: 'POST',
      data: {
        name,
        parentId,
      },
    }).then((res) => {
      return mutate(
        `/api/projects/${projectId}/folders`,
        (currentData: Folder[] | undefined) => {
          if (!currentData) return [res];
          return [...currentData, res];
        }
      );
    });
  },

  updateFolder: async (
    projectId: number,
    name: string,
    parentId: number | null,
    folderId: number
  ) => {
    return fetcher(`/api/projects/${projectId}/folders`, {
      method: 'PUT',
      data: {
        name,
        parentId,
        id: folderId,
      },
    }).then((res) =>
      mutate(
        `/api/projects/${projectId}/folders`,
        (data: Folder[] | undefined) => {
          if (!data) return [res];
          return data.map((item: Folder) =>
            item.id === folderId ? res : item
          );
        }
      )
    );
  },

  deleteFolder: async (projectId: number, folderId: number) => {
    return fetcher(`/api/projects/${projectId}/folders`, {
      method: 'DELETE',
      data: {
        folderId: folderId,
      },
    }).then(() =>
      mutate(
        `/api/projects/${projectId}/folders`,
        (currentData: Folder[] | undefined) => {
          if (!currentData) return [];
          return currentData.filter((item: Folder) => item.id !== folderId);
        }
      )
    );
  },
};

export default folderRequests;
