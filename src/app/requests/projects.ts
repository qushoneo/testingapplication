import axios from "axios";

const projectsRequest = {
  getAllProjects: async () => axios.get("/api/projects"),

  getProjectById: async (projectId: number) =>
    axios.get(`http://localhost:3000/api/projects/${projectId}`),
};

export default projectsRequest;
