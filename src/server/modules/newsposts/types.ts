import { Newspost } from '../../../fileDB/types';

export interface PaginationParams {
  page: number;
  size: number;
}

export type CreateNewspostInput = Pick<Newspost, 'title' | 'text'>;
export type UpdateNewspostInput = Partial<CreateNewspostInput>;
