const { parseArgs, parsePositiveIntArg, withClient, printJson, showConnectionHelp } = require('../pgUtils');

async function main() {
  const args = parseArgs();

  if (args.help) {
    console.log('Usage: node videos-scripts/paginate.js --page=1 --size=10 [--host=localhost --port=5432 --user=postgres --password=your_password --database=postgres]');
    showConnectionHelp();
    return;
  }

  const page = parsePositiveIntArg(args, 'page', 1);
  const size = parsePositiveIntArg(args, 'size', 10);
  const offset = (page - 1) * size;

  await withClient(args, async (client) => {
    const [itemsResult, totalResult] = await Promise.all([
      client.query('SELECT * FROM "videos" ORDER BY id LIMIT $1 OFFSET $2;', [size, offset]),
      client.query('SELECT COUNT(*)::int AS total FROM "videos";')
    ]);

    printJson({
      page,
      size,
      total: totalResult.rows[0].total,
      items: itemsResult.rows
    });
  });
}

main().catch((error) => {
  console.error('Failed to paginate records:', error.message);
  process.exit(1);
});
