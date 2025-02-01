import axios from "axios";

const projectsRequest = {
  getAllProjects: async () => axios.get("/api/projects"),

  getProjectById: async (projectId: number) =>
    axios.get(`/api/projects/${projectId}`),
};

export default projectsRequest;
