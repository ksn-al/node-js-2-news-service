import { Schema } from './types';

class SchemaRegistry {
  private schemas: Map<string, Schema> = new Map();

  registerSchema(tableName: string, schema: Schema): void {
    if (!tableName || typeof tableName !== 'string') {
      throw new Error('Table name must be a string');
    }
    if (!schema || typeof schema !== 'object') {
      throw new Error('Schema must be an object');
    }
    this.schemas.set(tableName, schema);
  }

  getSchema(tableName: string): Schema {
    const schema = this.schemas.get(tableName);
    if (!schema) {
      throw new Error(`Schema for table "${tableName}" not found`);
    }
    return schema;
  }
}

const schemaRegistry = new SchemaRegistry();

export const registerSchema = (tableName: string, schema: Schema): void => {
  schemaRegistry.registerSchema(tableName, schema);
};

export const getSchema = (tableName: string): Schema => {
  return schemaRegistry.getSchema(tableName);
};
