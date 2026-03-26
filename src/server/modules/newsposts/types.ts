import { Newspost, NewspostGenre, NEWSPOST_GENRES } from '../../../fileDB/types';

export interface PaginationParams {
  page: number;
  size: number;
}

export { NEWSPOST_GENRES };
export type { NewspostGenre };

export type CreateNewspostInput = Pick<Newspost, 'title' | 'text' | 'genre' | 'isPrivate'>;
export type UpdateNewspostInput = Partial<CreateNewspostInput>;
