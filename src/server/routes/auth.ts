import { NextFunction, Request, Response, Router } from 'express';
import authService from '../modules/auth/service';
import { validateLoginInput, validateRegisterInput } from '../modules/auth/validation';

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

const registerHandler = handleRoute((req, res) => {
  const payload = validateRegisterInput(req.body);
  const authResponse = authService.register(payload);
  res.status(201).json(authResponse);
});

router.post('/register', registerHandler);
router.post('/registration', registerHandler);

router.post('/login', handleRoute((req, res) => {
  const payload = validateLoginInput(req.body);
  const authResponse = authService.login(payload);
  res.status(200).json(authResponse);
}));

export default router;