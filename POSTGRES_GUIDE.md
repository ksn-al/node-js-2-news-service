# PostgreSQL scripts for `newsPosts`

## 1. Connection
By default, the scripts use:
- `host=localhost`
- `port=5432`
- `user=postgres`
- `database=postgres`

If needed, pass your own connection params in the command line:
```bash
--host=localhost --port=5432 --user=postgres --password=your_password --database=postgres
```

## 2. Commands
> Run them inside `file-db-project`, or use `npm run ...` from the workspace root.

Create the table:
```bash
node createTable.js --user=postgres --password=your_password --database=postgres
```

Get all records:
```bash
node getAll.js --user=postgres --password=your_password --database=postgres
```

Get one record by id:
```bash
node getById.js --id=1 --user=postgres --password=your_password --database=postgres
```

Insert a record:
```bash
node insert.js --title="News title" --text="News text" --created_date="2026-04-05" --user=postgres --password=your_password --database=postgres
```

Update only the fields you pass:
```bash
node update.js --id=4 --title="New title" --text="New text" --created_date="2026-04-05" --user=postgres --password=your_password --database=postgres
```

Delete a record:
```bash
node delete.js --id=4 --user=postgres --password=your_password --database=postgres
```
