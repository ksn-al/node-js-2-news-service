import { AppDataSource } from '../../database/dataSource';
import { DbNewspost, NewspostEntity, UserEntity } from '../../database/models';
import { PaginationParams, CreateNewspostInput, Newspost, UpdateNewspostInput } from './types';

function mapNewspost(record: DbNewspost): Newspost {
  return {
    id: record.id,
    title: record.title,
    text: record.text,
    genre: record.genre,
    isPrivate: record.isPrivate,
    createDate:
      record.createDate instanceof Date
        ? record.createDate.toISOString()
        : new Date(record.createDate).toISOString(),
    author: {
      id: record.author.id,
      email: record.author.email
    }
  };
}

class NewspostsRepository {
  private get newspostRepository() {
    return AppDataSource.getRepository(NewspostEntity);
  }

  private get userRepository() {
    return AppDataSource.getRepository(UserEntity);
  }

  async getAll(params: PaginationParams): Promise<Newspost[]> {
    const { page, size } = params;
    const records = await this.newspostRepository.find({
      order: {
        createDate: 'DESC',
        id: 'DESC'
      },
      skip: page * size,
      take: size
    });

    return records.map((item) => mapNewspost(item));
  }

  async getById(id: number): Promise<Newspost | null> {
    const record = await this.newspostRepository.findOne({ where: { id } });
    return record ? mapNewspost(record) : null;
  }

  async create(data: CreateNewspostInput, authorId: number): Promise<Newspost> {
    const author = await this.userRepository.findOne({ where: { id: authorId } });

    if (!author) {
      throw new Error(`Author with id ${authorId} was not found`);
    }

    const createdRecord = this.newspostRepository.create({
      ...data,
      author
    });

    const savedRecord = await this.newspostRepository.save(createdRecord);
    return mapNewspost(savedRecord);
  }

  async update(id: number, update: UpdateNewspostInput): Promise<Newspost | null> {
    const existingRecord = await this.newspostRepository.findOne({ where: { id } });

    if (!existingRecord) {
      return null;
    }

    const savedRecord = await this.newspostRepository.save({
      ...existingRecord,
      ...update
    });

    return mapNewspost(savedRecord);
  }

  async delete(id: number): Promise<number | null> {
    const result = await this.newspostRepository.delete({ id });
    return result.affected ? id : null;
  }
}

export default new NewspostsRepository();
