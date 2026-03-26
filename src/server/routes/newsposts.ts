import { NextFunction, Request, Response, Router } from 'express';
import { ValidationError } from '../errors/ValidationError';
import newspostsService from '../modules/newsposts/service';
import { PaginationParams } from '../modules/newsposts/types';
import { validateCreateNewspost, validateUpdateNewspost } from '../modules/newsposts/validation';

const router = Router();

function parsePaginationParams(query: Record<string, unknown>): PaginationParams {
  const pageRaw = typeof query.page === 'string' ? Number(query.page) : NaN;
  const sizeRaw = typeof query.size === 'string' ? Number(query.size) : NaN;

  const page = Number.isInteger(pageRaw) && pageRaw >= 0 ? pageRaw : 0;
  const size = Number.isInteger(sizeRaw) && sizeRaw > 0 ? sizeRaw : 10;

  return { page, size };
}

function parseId(rawId: string | string[]): number {
  const normalizedId = Array.isArray(rawId) ? rawId[0] : rawId;
  const id = Number(normalizedId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError('Newspost id must be a positive integer');
  }

  return id;
}

function handleRoute(handler: (req: Request, res: Response) => void) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

// GET /api/newsposts - отримати все новини
router.get('/', handleRoute((req, res) => {
  const params = parsePaginationParams(req.query as Record<string, unknown>);
  const newsposts = newspostsService.getAll(params);
  res.json(newsposts);
}));

router.get('/error', handleRoute((_req, _res) => {
  newspostsService.throwDemoError();
}));

// GET /api/newsposts/:id - отримати одну новину за id
router.get('/:id', handleRoute((req, res) => {
  const id = parseId(req.params.id);
  const newspost = newspostsService.getById(id);

  if (!newspost) {
    res.status(404).json({ error: 'Newspost not found' });
    return;
  }

  res.json(newspost);
}));

// POST /api/newsposts - створити нову новину
router.post('/', handleRoute((req, res) => {
  const payload = validateCreateNewspost(req.body);
  const newNewspost = newspostsService.create(payload);

  res.status(201).json(newNewspost);
}));

// PUT /api/newsposts/:id - оновити новину
router.put('/:id', handleRoute((req, res) => {
  const id = parseId(req.params.id);
  const payload = validateUpdateNewspost(req.body);
  const updatedNewspost = newspostsService.update(id, payload);

  if (!updatedNewspost) {
    res.status(404).json({ error: 'Newspost not found' });
    return;
  }

  res.json(updatedNewspost);
}));

// DELETE /api/newsposts/:id - видалити новину
router.delete('/:id', handleRoute((req, res) => {
  const id = parseId(req.params.id);
  const deletedId = newspostsService.delete(id);

  if (!deletedId) {
    res.status(404).json({ error: 'Newspost not found' });
    return;
  }

  res.status(200).json({ deletedId });
}));

export default router;
