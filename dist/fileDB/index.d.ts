import { registerSchema } from './schema';
import { Table, BaseRecord } from './types';
declare function getTable<T extends BaseRecord = BaseRecord>(tableName: string): Table<T>;
export { registerSchema, getTable };
//# sourceMappingURL=index.d.ts.map