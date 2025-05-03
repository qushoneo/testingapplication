import axios from 'axios';
import { fetcher } from '../lib/fetcher';
import { Project } from '@prisma/client';
import { mutate } from 'swr';

const projectsRequest = {
  getAllProjects: async () => fetcher('/api/projects'),

  getProjectById: async (projectId: number) =>
    fetcher(`/api/projects/${projectId}`),

  bulkDeleteProjects: async (projectIds: number[]) =>
    fetcher(`/api/projects`, {
      method: 'DELETE',
      data: {
        projectIds,
      },
    }),

  createProject: async (project: { name: string }) =>
    fetcher('/api/projects', {
      method: 'POST',
      data: project,
    }),
};

export default projectsRequest;
