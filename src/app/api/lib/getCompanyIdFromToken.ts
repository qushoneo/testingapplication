import { verifyToken } from '@/app/lib/auth';
import UserController from '../controllers/UserController';

export const getCompanyIdFromToken = async (token: string | undefined) => {
  try {
    if (!token) {
      throw new Error('no token provided');
    }

    const decodedToken = verifyToken(token);

    const user = await UserController.findById(decodedToken.id);

    return { id: user?.id, companyId: user?.companyId };
  } catch (e) {
    throw new Error('error');
  }
};
