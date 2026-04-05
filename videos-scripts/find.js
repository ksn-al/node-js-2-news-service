const { parseArgs, requireArg, withClient, printJson, showConnectionHelp } = require('../pgUtils');

async function main() {
  const args = parseArgs();

  if (args.help) {
    console.log("Usage: node videos-scripts/find.js --search='funny' [--host=localhost --port=5432 --user=postgres --password=your_password --database=postgres]");
    showConnectionHelp();
    return;
  }

  const search = requireArg(args, 'search', 'Argument --search is required.');

  await withClient(args, async (client) => {
    const result = await client.query(
      'SELECT * FROM "videos" WHERE title ILIKE $1 ORDER BY id;',
      [`%${search}%`]
    );

    printJson(result.rows);
  });
}

main().catch((error) => {
  console.error('Failed to find records:', error.message);
  process.exit(1);
});
