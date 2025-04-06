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
    }).then((res) => {
      mutate('/api/projects', (prevProjects: Project[] | undefined) => {
        if (!prevProjects) return [];
        return prevProjects.filter(
          (project: Project) => !projectIds.includes(project.id)
        );
      });
    }),
};

export default projectsRequest;
