import authService from '../modules/auth/service';
import { validateLoginInput, validateRegisterInput } from '../modules/auth/validation';
import { withErrorHandling } from '../utils/withErrorHandling';

export const register = withErrorHandling(async (req, res) => {
  const payload = validateRegisterInput(req.body);
  const authResponse = await authService.register(payload);
  res.status(201).json(authResponse);
});

export const login = withErrorHandling(async (req, res) => {
  const payload = validateLoginInput(req.body);
  const authResponse = await authService.login(payload);
  res.status(200).json(authResponse);
});
