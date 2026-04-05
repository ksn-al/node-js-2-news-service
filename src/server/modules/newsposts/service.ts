import { Newspost } from '../../../fileDB/types';
import { NewspostsServiceError } from '../../errors/NewspostsServiceError';
import newspostsRepository from './repository';
import { PaginationParams, CreateNewspostInput, UpdateNewspostInput } from './types';

class NewspostsService {
  async getAll(params: PaginationParams): Promise<Newspost[]> {
    try {
      return await newspostsRepository.getAll(params);
    } catch (error) {
      throw this.wrapError('Failed to fetch newsposts', error);
    }
  }

  async getById(id: number): Promise<Newspost | null> {
    try {
      return await newspostsRepository.getById(id);
    } catch (error) {
      throw this.wrapError(`Failed to fetch newspost with id ${id}`, error);
    }
  }

  async create(data: CreateNewspostInput): Promise<Newspost> {
    try {
      return await newspostsRepository.create(data);
    } catch (error) {
      throw this.wrapError('Failed to create newspost', error);
    }
  }

  async update(id: number, update: UpdateNewspostInput): Promise<Newspost | null> {
    try {
      return await newspostsRepository.update(id, update);
    } catch (error) {
      throw this.wrapError(`Failed to update newspost with id ${id}`, error);
    }
  }

  async delete(id: number): Promise<number | null> {
    try {
      return await newspostsRepository.delete(id);
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
