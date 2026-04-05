const { parseArgs, withClient, printJson, showConnectionHelp } = require('./pgUtils');

async function main() {
  const args = parseArgs();

  if (args.help) {
    console.log('Usage: node getAll.js [--host=localhost --port=5432 --user=postgres --password=your_password --database=postgres]');
    showConnectionHelp();
    return;
  }

  await withClient(args, async (client) => {
    const result = await client.query('SELECT * FROM "newsPosts" ORDER BY id;');
    printJson(result.rows);
  });
}

main().catch((error) => {
  console.error('Failed to fetch records:', error.message);
  process.exit(1);
});
