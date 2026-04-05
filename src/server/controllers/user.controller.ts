import { UnauthorizedError } from '../errors/UnauthorizedError';
import authService from '../modules/auth/service';
import { AuthenticatedUser } from '../modules/auth/types';
import { withErrorHandling } from '../utils/withErrorHandling';

export const getCurrentUser = withErrorHandling(async (req, res) => {
  const currentUser = req.user as AuthenticatedUser | undefined;

  if (!currentUser) {
    throw new UnauthorizedError('Request is not authorized');
  }

  const user = await authService.getAuthorizedUser(currentUser.id);
  res.status(200).json(user);
});
