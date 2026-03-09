"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchema = exports.registerSchema = void 0;
class SchemaRegistry {
    constructor() {
        this.schemas = new Map();
    }
    registerSchema(tableName, schema) {
        if (!tableName || typeof tableName !== 'string') {
            throw new Error('Table name must be a string');
        }
        if (!schema || typeof schema !== 'object') {
            throw new Error('Schema must be an object');
        }
        this.schemas.set(tableName, schema);
    }
    getSchema(tableName) {
        const schema = this.schemas.get(tableName);
        if (!schema) {
            throw new Error(`Schema for table "${tableName}" not found`);
        }
        return schema;
    }
}
const schemaRegistry = new SchemaRegistry();
const registerSchema = (tableName, schema) => {
    schemaRegistry.registerSchema(tableName, schema);
};
exports.registerSchema = registerSchema;
const getSchema = (tableName) => {
    return schemaRegistry.getSchema(tableName);
};
exports.getSchema = getSchema;
//# sourceMappingURL=schema.js.map