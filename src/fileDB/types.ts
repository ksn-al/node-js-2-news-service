export type FieldType = typeof Number | typeof String | typeof Boolean | typeof Date;

export type Schema = Record<string, FieldType>;

export interface BaseRecord {
  id: number;
  [key: string]: any;
}

export interface Newspost extends BaseRecord {
  title: string;
  text: string;
  createDate: string;
}

export type CreateInput<T extends BaseRecord> = Omit<T, 'id'>;
export type UpdateInput<T extends BaseRecord> = Partial<Omit<T, 'id'>>;
export type NormalizedValue = string | number | boolean | null | undefined;

export interface Table<T extends BaseRecord = BaseRecord> {
  getAll(): T[];
  getById(id: number): T | null;
  create(data: CreateInput<T>): T;
  update(id: number, patch: UpdateInput<T>): T | null;
  delete(id: number): number | null;
}

export type Database = Record<string, BaseRecord[]>;
