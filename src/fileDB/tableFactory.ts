import { readDB, writeDB } from './storage';
import { Schema, Table, BaseRecord, NormalizedValue, FieldType } from './types';

function normalizeFieldValue(expectedType: FieldType, value: unknown): NormalizedValue {
  if (expectedType === Number) {
    return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
  }

  if (expectedType === String) {
    return typeof value === 'string' ? value : undefined;
  }

  if (expectedType === Boolean) {
    return typeof value === 'boolean' ? value : undefined;
  }

  if (expectedType === Date) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value.toISOString();
    }

    if (typeof value === 'string' || typeof value === 'number') {
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
    }

    return undefined;
  }

  return undefined;
}

interface PickFieldsOptions {
  allowId?: boolean;
  onlyPresent?: boolean;
}

function pickAllowedFields(
  input: unknown,
  schema: Schema,
  options: PickFieldsOptions = {}
): Record<string, NormalizedValue> {
  const { allowId = false, onlyPresent = true } = options;
  const result: Record<string, NormalizedValue> = {};
  const source = input && typeof input === 'object' ? (input as Record<string, unknown>) : {};

  const schemaKeys = Object.keys(schema);

  for (const key of schemaKeys) {
    if (!allowId && key === 'id') continue;
    if (onlyPresent && !Object.prototype.hasOwnProperty.call(source, key)) continue;

    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const normalized = normalizeFieldValue(schema[key], source[key]);
      if (normalized !== undefined) {
        result[key] = normalized;
      }
    }
  }

  return result;
}

function ensureTableArray(db: Record<string, unknown>, tableName: string): BaseRecord[] {
  if (!db[tableName]) {
    db[tableName] = [];
  }
  if (!Array.isArray(db[tableName])) {
    db[tableName] = [];
  }
  return db[tableName] as BaseRecord[];
}

function generateId(records: BaseRecord[]): number {
  if (!records.length) return 1;
  const ids = records.map(r => r.id).filter((n): n is number => typeof n === 'number');
  const maxId = ids.length ? Math.max(...ids) : 0;
  return maxId + 1;
}

export function createTable<T extends BaseRecord = BaseRecord>(
  tableName: string,
  schema: Schema
): Table<T> {
  return {
    getAll(): T[] {
      const db = readDB();
      const records = db[tableName] || [];
      return Array.isArray(records) ? (records as T[]) : [];
    },

    getById(id: number): T | null {
      const db = readDB();
      const records = db[tableName] || [];
      if (!Array.isArray(records)) return null;
      return (records.find(r => r.id === id) as T) || null;
    },

    create(data: Record<string, unknown>): T {
      const db = readDB();
      const records = ensureTableArray(db, tableName);

      const newId = generateId(records);
      const allowed = pickAllowedFields(data, schema, { allowId: false, onlyPresent: true });

      if (
        Object.prototype.hasOwnProperty.call(schema, 'createDate') &&
        !Object.prototype.hasOwnProperty.call(allowed, 'createDate')
      ) {
        allowed.createDate = new Date().toISOString();
      }

      const newRecord: T = { id: newId, ...allowed } as T;

      records.push(newRecord);
      db[tableName] = records;
      writeDB(db);

      return newRecord;
    },

    update(id: number, patch: Record<string, unknown>): T | null {
      const db = readDB();
      const records = ensureTableArray(db, tableName);

      const idx = records.findIndex(r => r.id === id);
      if (idx === -1) return null;

      const allowedPatch = pickAllowedFields(patch, schema, { allowId: false, onlyPresent: true });
      records[idx] = { ...records[idx], ...allowedPatch };
      db[tableName] = records;
      writeDB(db);

      return records[idx] as T;
    },

    delete(id: number): number | null {
      const db = readDB();
      const records = ensureTableArray(db, tableName);

      const idx = records.findIndex(r => r.id === id);
      if (idx === -1) return null;

      records.splice(idx, 1);
      db[tableName] = records;
      writeDB(db);

      return id;
    }
  };
}
