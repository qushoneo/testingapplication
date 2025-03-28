'use client';

import axios from 'axios';
import { fetcher } from '../lib/fetcher';
import { mutate } from 'swr';

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
    }).then((res) =>
      mutate(`/api/projects/${projectId}/folders`, (data: any) => [
        ...data,
        res,
      ])
    );
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
        folderId,
      },
    }).then((res) =>
      mutate(`/api/projects/${projectId}/folders`, (data: any) =>
        data.map((item: any) => (item.id === folderId ? res : item))
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
      mutate(`/api/projects/${projectId}/folders`, (data: any) =>
        data.filter((item: any) => item.id !== folderId)
      )
    );
  },
};

export default folderRequests;
