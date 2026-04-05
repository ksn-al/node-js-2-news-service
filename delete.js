const { parseArgs, requireIntArg, withClient, printJson, showConnectionHelp } = require('./pgUtils');

async function main() {
  const args = parseArgs();

  if (args.help) {
    console.log('Usage: node delete.js --id=4 [--host=localhost --port=5432 --user=postgres --password=your_password --database=postgres]');
    showConnectionHelp();
    return;
  }

  const id = requireIntArg(args, 'id');

  await withClient(args, async (client) => {
    const result = await client.query('DELETE FROM "newsPosts" WHERE id = $1 RETURNING *;', [id]);

    if (result.rows.length === 0) {
      console.log(`Record with id=${id} not found.`);
      return;
    }

    printJson(result.rows[0]);
  });
}

main().catch((error) => {
  console.error('Failed to delete record:', error.message);
  process.exit(1);
});
