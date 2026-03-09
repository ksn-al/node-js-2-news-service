const { registerSchema, getSchema } = require('./schema');
const { createTable } = require('./tableFactory');

function getTable(tableName) {
  const schema = getSchema(tableName);
  return createTable(tableName, schema);
}

module.exports = {
  registerSchema,
  getTable,
};