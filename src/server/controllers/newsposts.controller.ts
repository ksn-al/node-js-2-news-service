import newspostsService from '../modules/newsposts/service';
import { validateCreateNewspost, validateUpdateNewspost } from '../modules/newsposts/validation';
import { parsePaginationParams } from '../utils/parsePaginationParams';
import { parsePositiveIdParam } from '../utils/parsePositiveIdParam';
import { withErrorHandling } from '../utils/withErrorHandling';
import { AuthenticatedUser } from '../modules/auth/types';
import { UnauthorizedError } from '../errors/UnauthorizedError';

export const getNewsposts = withErrorHandling(async (req, res) => {
  const params = parsePaginationParams(req.query as Record<string, unknown>);
  const newsposts = await newspostsService.getAll(params);
  res.json(newsposts);
});

export const throwDemoError = withErrorHandling((_req, _res) => {
  newspostsService.throwDemoError();
});

export const getNewspostById = withErrorHandling(async (req, res) => {
  const id = parsePositiveIdParam(req.params.id);
  const newspost = await newspostsService.getById(id);

  if (!newspost) {
    res.status(404).json({ error: 'Newspost not found' });
    return;
  }

  res.json(newspost);
});

export const createNewspost = withErrorHandling(async (req, res) => {
  const currentUser = req.user as AuthenticatedUser | undefined;

  if (!currentUser) {
    throw new UnauthorizedError('Request is not authorized');
  }

  const payload = validateCreateNewspost(req.body);
  const newNewspost = await newspostsService.create(payload, currentUser.id);

  res.status(201).json(newNewspost);
});

export const updateNewspost = withErrorHandling(async (req, res) => {
  const id = parsePositiveIdParam(req.params.id);
  const payload = validateUpdateNewspost(req.body);
  const updatedNewspost = await newspostsService.update(id, payload);

  if (!updatedNewspost) {
    res.status(404).json({ error: 'Newspost not found' });
    return;
  }

  res.json(updatedNewspost);
});

export const deleteNewspost = withErrorHandling(async (req, res) => {
  const id = parsePositiveIdParam(req.params.id);
  const deletedId = await newspostsService.delete(id);

  if (!deletedId) {
    res.status(404).json({ error: 'Newspost not found' });
    return;
  }

  res.status(200).json({ deletedId });
});
