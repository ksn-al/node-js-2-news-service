import { getTable, registerSchema } from '../../../fileDB';
import { Newspost } from '../../../fileDB/types';
import { PaginationParams, CreateNewspostInput, UpdateNewspostInput } from './types';

const newspostSchema = {
  id: Number,
  title: String,
  text: String,
  genre: String,
  isPrivate: Boolean,
  createDate: Date,
};

registerSchema('newsposts', newspostSchema);

const newspostTable = getTable<Newspost>('newsposts');

class NewspostsRepository {
  async getAll(params: PaginationParams): Promise<Newspost[]> {
    const { page, size } = params;
    const allRecords = newspostTable.getAll();
    const start = page * size;
    return allRecords.slice(start, start + size);
  }

  async getById(id: number): Promise<Newspost | null> {
    return newspostTable.getById(id);
  }

  async create(data: CreateNewspostInput): Promise<Newspost> {
    return newspostTable.create(data);
  }

  async update(id: number, update: UpdateNewspostInput): Promise<Newspost | null> {
    return newspostTable.update(id, update);
  }

  async delete(id: number): Promise<number | null> {
    return newspostTable.delete(id);
  }
}

export default new NewspostsRepository();
