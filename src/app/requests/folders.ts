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
};

export default folderRequests;
