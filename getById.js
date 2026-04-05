const { parseArgs, requireIntArg, withClient, printJson, showConnectionHelp } = require('./pgUtils');

async function main() {
  const args = parseArgs();

  if (args.help) {
    console.log('Usage: node getById.js --id=1 [--host=localhost --port=5432 --user=postgres --password=your_password --database=postgres]');
    showConnectionHelp();
    return;
  }

  const id = requireIntArg(args, 'id');

  await withClient(args, async (client) => {
    const result = await client.query('SELECT * FROM "newsPosts" WHERE id = $1;', [id]);

    if (result.rows.length === 0) {
      console.log(`Record with id=${id} not found.`);
      return;
    }

    printJson(result.rows[0]);
  });
}

main().catch((error) => {
  console.error('Failed to fetch record:', error.message);
  process.exit(1);
});
