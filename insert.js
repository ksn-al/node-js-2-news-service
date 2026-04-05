const { parseArgs, requireArg, withClient, printJson, showConnectionHelp } = require('./pgUtils');

async function main() {
  const args = parseArgs();

  if (args.help) {
    console.log("Usage: node insert.js --title='News title' --text='News text' [--created_date='2026-04-05'] [--host=localhost --port=5432 --user=postgres --password=your_password --database=postgres]");
    showConnectionHelp();
    return;
  }

  const title = requireArg(args, 'title', 'Argument --title is required.');
  const text = requireArg(args, 'text', 'Argument --text is required.');

  const columns = ['title', 'text'];
  const values = [title, text];

  if (args.created_date !== undefined) {
    columns.push('created_date');
    values.push(args.created_date);
  }

  const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
  const sql = `INSERT INTO "newsPosts" (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *;`;

  await withClient(args, async (client) => {
    const result = await client.query(sql, values);
    printJson(result.rows[0]);
  });
}

main().catch((error) => {
  console.error('Failed to insert record:', error.message);
  process.exit(1);
});
