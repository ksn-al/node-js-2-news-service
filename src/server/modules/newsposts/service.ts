import { Newspost } from '../../../fileDB/types';
import newspostsRepository from './repository';
import { PaginationParams, CreateNewspostInput, UpdateNewspostInput } from './types';

class NewspostsService {
  getAll(params: PaginationParams): Newspost[] {
    return newspostsRepository.getAll(params);
  }

  getById(id: number): Newspost | null {
    return newspostsRepository.getById(id);
  }

  create(data: CreateNewspostInput): Newspost {
    return newspostsRepository.create(data);
  }

  update(id: number, update: UpdateNewspostInput): Newspost | null {
    return newspostsRepository.update(id, update);
  }

  delete(id: number): number | null {
    return newspostsRepository.delete(id);
  }
}

export default new NewspostsService();
