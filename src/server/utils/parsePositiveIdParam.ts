import { ValidationError } from '../errors/ValidationError';

export function parsePositiveIdParam(rawId: string | string[]): number {
  const normalizedId = Array.isArray(rawId) ? rawId[0] : rawId;
  const id = Number(normalizedId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError('Newspost id must be a positive integer');
  }

  return id;
}
