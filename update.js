const { parseArgs, requireIntArg, withClient, printJson, showConnectionHelp } = require('./pgUtils');

async function main() {
  const args = parseArgs();

  if (args.help) {
    console.log("Usage: node update.js --id=4 [--title='New title'] [--text='New text'] [--created_date='2026-04-05'] [--host=localhost --port=5432 --user=postgres --password=your_password --database=postgres]");
    showConnectionHelp();
    return;
  }

  const id = requireIntArg(args, 'id');
  const allowedFields = ['title', 'text', 'created_date'];
  const updates = allowedFields.filter((field) => args[field] !== undefined);

  if (updates.length === 0) {
    throw new Error('Pass at least one field to update: --title, --text or --created_date.');
  }

  const values = updates.map((field) => args[field]);
  const setClause = updates
    .map((field, index) => `${field} = $${index + 1}`)
    .join(', ');

  await withClient(args, async (client) => {
    const result = await client.query(
      `UPDATE "newsPosts" SET ${setClause} WHERE id = $${values.length + 1} RETURNING *;`,
      [...values, id]
    );

    if (result.rows.length === 0) {
      console.log(`Record with id=${id} not found.`);
      return;
    }

    printJson(result.rows[0]);
  });
}

main().catch((error) => {
  console.error('Failed to update record:', error.message);
  process.exit(1);
});
