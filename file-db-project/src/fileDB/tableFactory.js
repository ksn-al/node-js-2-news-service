const { readDB, writeDB } = require('./storage');

function createTable(tableName, schema) {
  function normalizeFieldValue(expectedType, value) {
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

  function pickAllowedFields(input, { allowId = false, onlyPresent = true } = {}) {
    const result = {};
    const source = input && typeof input === 'object' ? input : {};

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

  function ensureTableArray(db) {
    if (!db[tableName]) db[tableName] = [];
    if (!Array.isArray(db[tableName])) db[tableName] = [];
    return db[tableName];
  }

  function generateId(records) {
    if (!records.length) return 1;
    const ids = records.map(r => r.id).filter(n => typeof n === 'number');
    const maxId = ids.length ? Math.max(...ids) : 0;
    return maxId + 1;
  }

  return {
    getAll() {
      const db = readDB();
      const records = db[tableName] || [];
      return Array.isArray(records) ? records : [];
    },

    getById(id) {
      const db = readDB();
      const records = db[tableName] || [];
      if (!Array.isArray(records)) return null;
      return records.find(r => r.id === id) || null;
    },

    create(data) {
      const db = readDB();
      const records = ensureTableArray(db);

      const newId = generateId(records);

      const allowed = pickAllowedFields(data, { allowId: false, onlyPresent: true });

      if (Object.prototype.hasOwnProperty.call(schema, 'createDate') && !Object.prototype.hasOwnProperty.call(allowed, 'createDate')) {
        allowed.createDate = new Date().toISOString();
      }

      const newRecord = { id: newId, ...allowed };

      records.push(newRecord);
      db[tableName] = records;
      writeDB(db);

      return newRecord;
    },

    update(id, patch) {
      const db = readDB();
      const records = ensureTableArray(db);

      const idx = records.findIndex(r => r.id === id);
      if (idx === -1) return null;

      const allowedPatch = pickAllowedFields(patch, { allowId: false, onlyPresent: true });

      records[idx] = { ...records[idx], ...allowedPatch };
      db[tableName] = records;
      writeDB(db);

      return records[idx];
    },

    delete(id) {
      const db = readDB();
      const records = ensureTableArray(db);

      const idx = records.findIndex(r => r.id === id);
      if (idx === -1) return null;

      records.splice(idx, 1);
      db[tableName] = records;
      writeDB(db);

      return id;
    }
  };
}

module.exports = { createTable };
