import { NextFunction, Request, Response, Router } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import authService from '../modules/auth/service';
import { AuthenticatedUser } from '../modules/auth/types';
import { requireAuth } from '../passport';

const router = Router();

function handleRoute(handler: (req: Request, res: Response) => void) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

router.get('/', requireAuth, handleRoute((req, res) => {
  const currentUser = req.user as AuthenticatedUser | undefined;

  if (!currentUser) {
    throw new UnauthorizedError('Request is not authorized');
  }

  const user = authService.getAuthorizedUser(currentUser.id);
  res.status(200).json(user);
}));

export default router;