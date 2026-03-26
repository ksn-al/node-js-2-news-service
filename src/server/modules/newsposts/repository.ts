import { getTable, registerSchema } from '../../../fileDB';
import { Newspost } from '../../../fileDB/types';
import { PaginationParams, CreateNewspostInput, UpdateNewspostInput } from './types';

const newspostSchema = {
  id: Number,
  title: String,
  text: String,
  createDate: Date,
};

registerSchema('newsposts', newspostSchema);

const newspostTable = getTable<Newspost>('newsposts');

class NewspostsRepository {
  getAll(params: PaginationParams): Newspost[] {
    const { page, size } = params;
    const allRecords = newspostTable.getAll();
    const start = page * size;
    return allRecords.slice(start, start + size);
  }

  getById(id: number): Newspost | null {
    return newspostTable.getById(id);
  }

  create(data: CreateNewspostInput): Newspost {
    return newspostTable.create(data);
  }

  update(id: number, update: UpdateNewspostInput): Newspost | null {
    return newspostTable.update(id, update);
  }

  delete(id: number): number | null {
    return newspostTable.delete(id);
  }
}

export default new NewspostsRepository();
