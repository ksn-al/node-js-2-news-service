import { Newspost } from '../../../fileDB/types';
import { NewspostsServiceError } from '../../errors/NewspostsServiceError';
import newspostsRepository from './repository';
import { PaginationParams, CreateNewspostInput, UpdateNewspostInput } from './types';

class NewspostsService {
  getAll(params: PaginationParams): Newspost[] {
    try {
      return newspostsRepository.getAll(params);
    } catch (error) {
      throw this.wrapError('Failed to fetch newsposts', error);
    }
  }

  getById(id: number): Newspost | null {
    try {
      return newspostsRepository.getById(id);
    } catch (error) {
      throw this.wrapError(`Failed to fetch newspost with id ${id}`, error);
    }
  }

  create(data: CreateNewspostInput): Newspost {
    try {
      return newspostsRepository.create(data);
    } catch (error) {
      throw this.wrapError('Failed to create newspost', error);
    }
  }

  update(id: number, update: UpdateNewspostInput): Newspost | null {
    try {
      return newspostsRepository.update(id, update);
    } catch (error) {
      throw this.wrapError(`Failed to update newspost with id ${id}`, error);
    }
  }

  delete(id: number): number | null {
    try {
      return newspostsRepository.delete(id);
    } catch (error) {
      throw this.wrapError(`Failed to delete newspost with id ${id}`, error);
    }
  }

  throwDemoError(): never {
    throw new NewspostsServiceError('NewspostsService demo error');
  }

  private wrapError(message: string, error: unknown): NewspostsServiceError {
    if (error instanceof NewspostsServiceError) {
      return error;
    }

    return new NewspostsServiceError(message, error);
  }
}

export default new NewspostsService();
