import { initializeDatabase, AppDataSource } from './dataSource';
import { logger } from '../logger';

async function main(): Promise<void> {
  try {
    await initializeDatabase();
    logger.info('Migrations completed successfully');
  } catch (error) {
    logger.error('Failed to run migrations', { error });
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

void main();
