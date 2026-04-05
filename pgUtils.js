const { Client, types } = require('pg');

types.setTypeParser(types.builtins.DATE, (value) => value);

function parseArgs(argv = process.argv.slice(2)) {
  return argv.reduce((result, item) => {
    if (!item.startsWith('--')) {
      return result;
    }

    const trimmed = item.slice(2);
    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      result[trimmed] = true;
      return result;
    }

    const key = trimmed.slice(0, separatorIndex);
    const value = trimmed.slice(separatorIndex + 1);
    result[key] = value;
    return result;
  }, {});
}

function getConnectionConfig(args = {}) {
  return {
    host: args.host || process.env.PGHOST || 'localhost',
    port: Number(args.port || process.env.PGPORT || 5432),
    user: args.user || process.env.PGUSER || 'postgres',
    password: args.password ?? process.env.PGPASSWORD ?? '',
    database: args.database || process.env.PGDATABASE || 'postgres'
  };
}

function requireArg(args, name, customMessage) {
  const value = args[name];

  if (value === undefined || value === '') {
    throw new Error(customMessage || `Missing required argument --${name}`);
  }

  return value;
}

function parsePositiveIntArg(args, name, fallbackValue) {
  const rawValue = args[name] ?? fallbackValue;

  if (rawValue === undefined || rawValue === '') {
    throw new Error(`Argument --${name} is required.`);
  }

  const parsedValue = Number(rawValue);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new Error(`Argument --${name} must be a positive integer.`);
  }

  return parsedValue;
}

function requireIntArg(args, name) {
  return parsePositiveIntArg(args, name);
}

function requireFloatArg(args, name) {
  const rawValue = requireArg(args, name, `Argument --${name} is required.`);
  const parsedValue = Number(rawValue);

  if (!Number.isFinite(parsedValue)) {
    throw new Error(`Argument --${name} must be a number.`);
  }

  return parsedValue;
}

async function withClient(args, work) {
  const client = new Client(getConnectionConfig(args));
  await client.connect();

  try {
    return await work(client);
  } finally {
    await client.end();
  }
}

function normalizeDates(value) {
  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }

  if (Array.isArray(value)) {
    return value.map(normalizeDates);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, normalizeDates(nestedValue)])
    );
  }

  return value;
}

function printJson(value) {
  console.log(JSON.stringify(normalizeDates(value), null, 2));
}

function showConnectionHelp() {
  console.log('Connection params (optional): --host=localhost --port=5432 --user=postgres --password=your_password --database=postgres');
}

module.exports = {
  parseArgs,
  requireArg,
  requireIntArg,
  requireFloatArg,
  parsePositiveIntArg,
  withClient,
  printJson,
  showConnectionHelp
};
