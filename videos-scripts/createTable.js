const { parseArgs, withClient, showConnectionHelp } = require('../pgUtils');

async function main() {
  const args = parseArgs();

  if (args.help) {
    console.log('Usage: node videos-scripts/createTable.js [--host=localhost --port=5432 --user=postgres --password=your_password --database=postgres]');
    showConnectionHelp();
    return;
  }

  await withClient(args, async (client) => {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "videos" (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        views REAL NOT NULL CHECK (views >= 0),
        category TEXT NOT NULL
      );
    `);

    console.log('Table "videos" is ready.');
  });
}

main().catch((error) => {
  console.error('Failed to create table:', error.message);
  process.exit(1);
});
