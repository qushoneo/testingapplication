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

  createProject: async (project: { name: string }) =>
    fetcher('/api/projects', {
      method: 'POST',
      data: project,
    }).then((res) => {
      mutate('/api/projects', (prevProjects: Project[] | undefined) => {
        if (!prevProjects) return [];
        return [...prevProjects, res];
      });
    }),
};

export default projectsRequest;
