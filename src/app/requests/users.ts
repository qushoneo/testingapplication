import axios from 'axios';

const userRequests = {
  getAllUsers: async () => axios.get('/api/users'),

  getUserById: async (projectId: number) =>
    axios.get(`/api/users/${projectId}`),
};

export default userRequests;
