"use client";

import axios from "axios";

const folderRequests = {
  getFoldersByProjectId: async (projectId: number) => {
    return axios.get(`/api/projects/${projectId}/folders`);
  },

  createFolder: async (
    projectId: number,
    name: string,
    parentId: number | null
  ) => {
    return axios.post(`/api/projects/${projectId}/folders`, {
      name,
      parentId,
    });
  },

  updateFolder: async (
    projectId: number,
    name: string,
    parentId: number | null,
    folderId: number
  ) => {
    return axios.put(`/api/projects/${projectId}/folders`, {
      name,
      parentId,
      folderId,
    });
  },

  deleteFolder: async (projectId: number, folderId: number) => {
    return axios.delete(`/api/projects/${projectId}/folders`, {
      data: {
        folderId: folderId,
      },
    });
  },
};

export default folderRequests;
