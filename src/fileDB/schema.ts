import { Schema } from './types';

class SchemaRegistry {
  private readonly schemas: Map<string, Schema> = new Map();

  registerSchema(tableName: string, schema: Schema): void {
    if (tableName.trim().length === 0) {
      throw new Error('Table name must not be empty');
    }
    if (Object.keys(schema).length === 0) {
      throw new Error('Schema must contain at least one field');
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
