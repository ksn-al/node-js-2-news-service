const { parseArgs, withClient, showConnectionHelp } = require('./pgUtils');

async function main() {
  const args = parseArgs();

  if (args.help) {
    console.log('Usage: node createTable.js [--host=localhost --port=5432 --user=postgres --password=your_password --database=postgres]');
    showConnectionHelp();
    return;
  }

  await withClient(args, async (client) => {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "newsPosts" (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        text TEXT NOT NULL,
        created_date DATE NOT NULL DEFAULT CURRENT_DATE
      );
    `);

    console.log('Table "newsPosts" is ready.');
  });
}

main().catch((error) => {
  console.error('Failed to create table:', error.message);
  process.exit(1);
});
