import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { logger } from '../logger';
import { NewspostEntity, UserEntity } from './models';
import { AddDeletedAndHeaderToPosts1712448000000 } from './migrations/1712448000000-AddDeletedAndHeaderToPosts';

const databaseUrl = process.env.DATABASE_URL;
const host = process.env.PGHOST || 'localhost';
const port = Number(process.env.PGPORT || 5432);
const username = process.env.PGUSER || 'postgres';
const password = process.env.PGPASSWORD || '';
const database = process.env.PGDATABASE || 'postgres';
const shouldUseSsl = process.env.PGSSLMODE === 'require' || process.env.NODE_ENV === 'production';

const connectionOptions = databaseUrl
  ? {
      url: databaseUrl,
      ssl: shouldUseSsl ? { rejectUnauthorized: false } : false
    }
  : {
      host,
      port,
      username,
      password,
      database,
      ssl: shouldUseSsl ? { rejectUnauthorized: false } : false
    };

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...connectionOptions,
  synchronize: false,
  logging: false,
  entities: [UserEntity, NewspostEntity],
  migrations: [AddDeletedAndHeaderToPosts1712448000000]
});

export async function initializeDatabase(): Promise<DataSource> {
  if (AppDataSource.isInitialized) {
    return AppDataSource;
  }

  const dataSource = await AppDataSource.initialize();
  await dataSource.runMigrations();
  logger.info('PostgreSQL connection established', {
    connection: databaseUrl ? 'DATABASE_URL' : `${host}:${port}/${database}`,
    ssl: shouldUseSsl
  });
  return dataSource;
}
