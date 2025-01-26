import axios from "axios";

const projectsRequest = {
  getAllProjects: async () => {
    return axios.get("/api/projects");
  },
};

export default projectsRequest;
