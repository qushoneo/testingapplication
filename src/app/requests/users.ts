import { fetcher } from '../lib/fetcher';

const usersRequest = {
  inviteUser: async (email: string) => {
    return fetcher('/api/invite', {
      method: 'POST',
      data: { email },
    });
  },
};

export default usersRequest;
