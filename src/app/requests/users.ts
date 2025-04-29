import { ForgotPassword, User } from '@prisma/client';
import { fetcher } from '../lib/fetcher';

const usersRequest = {
  inviteUser: async (email: User['email']) => {
    return fetcher('/api/invite', {
      method: 'POST',
      data: { email },
    });
  },

  forgotPasswordInitial: async (email: User['email']) => {
    return fetcher('/api/forgot_password', {
      method: 'POST',
      data: { email },
    });
  },

  sendCode: async (email: User['email'], code: ForgotPassword['validCode']) => {
    return fetcher('/api/forgot_password/send_code', {
      method: 'POST',
      data: {
        email,
        code,
      },
    });
  },

  changePassword: async (
    email: User['email'],
    newPassword: User['password']
  ) => {
    return fetcher('/api/forgot_password/change_password', {
      method: 'PATCH',
      data: {
        email,
        newPassword,
      },
    });
  },
};

export default usersRequest;
