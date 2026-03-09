import { registerSchema, getSchema } from './schema';
import { createTable } from './tableFactory';
import { Schema, Table, BaseRecord } from './types';

function getTable<T extends BaseRecord = BaseRecord>(tableName: string): Table<T> {
  const schema: Schema = getSchema(tableName);
  return createTable<T>(tableName, schema);
}

export { registerSchema, getTable };
