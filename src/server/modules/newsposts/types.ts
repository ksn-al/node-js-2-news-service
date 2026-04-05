import { NewspostGenre, NEWSPOST_GENRES } from '../../database/models';

export interface PaginationParams {
  page: number;
  size: number;
}

export interface NewspostAuthor {
  id: number;
  email: string;
}

export interface Newspost {
  id: number;
  title: string;
  text: string;
  genre: NewspostGenre;
  isPrivate: boolean;
  createDate: string;
  author: NewspostAuthor;
}

export { NEWSPOST_GENRES };
export type { NewspostGenre };

export type CreateNewspostInput = Pick<Newspost, 'title' | 'text' | 'genre' | 'isPrivate'>;
export type UpdateNewspostInput = Partial<CreateNewspostInput>;
