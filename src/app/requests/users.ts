import { fetcher } from '../lib/fetcher';

const usersRequest = {
  inviteUser: async (email: string) => {
    return fetcher('/api/users/invite', {
      method: 'POST',
      data: { email },
    });
  },
};

export default usersRequest;
