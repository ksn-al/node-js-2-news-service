import { PaginationParams } from '../modules/newsposts/types';

export function parsePaginationParams(query: Record<string, unknown>): PaginationParams {
  const pageRaw = typeof query.page === 'string' ? Number(query.page) : NaN;
  const sizeRaw = typeof query.size === 'string' ? Number(query.size) : NaN;

  const page = Number.isInteger(pageRaw) && pageRaw >= 0 ? pageRaw : 0;
  const size = Number.isInteger(sizeRaw) && sizeRaw > 0 ? sizeRaw : 10;

  return { page, size };
}
