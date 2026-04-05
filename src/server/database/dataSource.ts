import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { logger } from '../logger';
import { NewspostEntity, UserEntity } from './models';

const host = process.env.PGHOST || 'localhost';
const port = Number(process.env.PGPORT || 5432);
const username = process.env.PGUSER || 'postgres';
const password = process.env.PGPASSWORD || '';
const database = process.env.PGDATABASE || 'postgres';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host,
  port,
  username,
  password,
  database,
  synchronize: true,
  logging: false,
  entities: [UserEntity, NewspostEntity]
});

export async function initializeDatabase(): Promise<DataSource> {
  if (AppDataSource.isInitialized) {
    return AppDataSource;
  }

  const dataSource = await AppDataSource.initialize();
  logger.info('PostgreSQL connection established', { host, port, database });
  return dataSource;
}
