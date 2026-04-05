const { parseArgs, requireArg, requireFloatArg, withClient, printJson, showConnectionHelp } = require('../pgUtils');

async function main() {
  const args = parseArgs();

  if (args.help) {
    console.log("Usage: node videos-scripts/insert.js --title='Video title' --views=105.5 --category='funny' [--host=localhost --port=5432 --user=postgres --password=your_password --database=postgres]");
    showConnectionHelp();
    return;
  }

  const title = requireArg(args, 'title', 'Argument --title is required.');
  const views = requireFloatArg(args, 'views');
  const category = requireArg(args, 'category', 'Argument --category is required.');

  await withClient(args, async (client) => {
    const result = await client.query(
      'INSERT INTO "videos" (title, views, category) VALUES ($1, $2, $3) RETURNING *;',
      [title, views, category]
    );

    printJson(result.rows[0]);
  });
}

main().catch((error) => {
  console.error('Failed to insert record:', error.message);
  process.exit(1);
});
