const { parseArgs, parsePositiveIntArg, withClient, showConnectionHelp } = require('../pgUtils');

async function main() {
  const args = parseArgs();

  if (args.help) {
    console.log('Usage: node videos-scripts/top.js --top=5 [--host=localhost --port=5432 --user=postgres --password=your_password --database=postgres]');
    showConnectionHelp();
    return;
  }

  const top = parsePositiveIntArg(args, 'top', 5);

  await withClient(args, async (client) => {
    const result = await client.query(
      `
        SELECT category, ROUND(SUM(views)::numeric, 2) AS total_views
        FROM "videos"
        GROUP BY category
        ORDER BY total_views DESC, category ASC
        LIMIT $1;
      `,
      [top]
    );

    if (result.rows.length === 0) {
      console.log('No categories found.');
      return;
    }

    result.rows.forEach((row) => {
      console.log(`${row.category} - ${row.total_views}`);
    });
  });
}

main().catch((error) => {
  console.error('Failed to get top categories:', error.message);
  process.exit(1);
});
