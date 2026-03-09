const schemas = {};

function registerSchema(tableName, schema) {
    if (!tableName || typeof tableName !== 'string') {
        throw new Error('Table name must be a string');
    }
    if (!schema || typeof schema !== 'object') {
        throw new Error('Schema must be an object');
    }
    schemas[tableName] = schema;
}

function getSchema(tableName) {
    const schema = schemas[tableName];
    if (!schema) {
        throw new Error(`Schema for table "${tableName}" not found`);
    }
    return schema;
}

module.exports = { registerSchema, getSchema };


