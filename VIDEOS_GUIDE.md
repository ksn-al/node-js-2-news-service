# Videos PostgreSQL scripts

These scripts are in `videos-scripts/` and use the `pg` package.

## Table
`videos`
- `id` — integer primary key (`SERIAL`)
- `title` — `TEXT`
- `views` — `FLOAT4` (`REAL`)
- `category` — `TEXT`

## Commands
Create the table:
```bash
node videos-scripts/createTable.js --user=postgres --password=your_password --database=postgres
```

Insert a video:
```bash
node videos-scripts/insert.js --title="Funny cats" --views=150.5 --category="funny" --user=postgres --password=your_password --database=postgres
```

Paginate:
```bash
node videos-scripts/paginate.js --page=1 --size=10 --user=postgres --password=your_password --database=postgres
```

Find by title:
```bash
node videos-scripts/find.js --search="funny" --user=postgres --password=your_password --database=postgres
```

Group by category:
```bash
node videos-scripts/group.js --user=postgres --password=your_password --database=postgres
```

Top categories:
```bash
node videos-scripts/top.js --top=5 --user=postgres --password=your_password --database=postgres
```

## npm shortcuts
From `file-db-project`:
```bash
npm run videos:create-table -- --user=postgres --password=your_password --database=postgres
npm run videos:insert -- --title="Funny cats" --views=150.5 --category="funny" --user=postgres --password=your_password --database=postgres
npm run videos:paginate -- --page=1 --size=10 --user=postgres --password=your_password --database=postgres
npm run videos:find -- --search="funny" --user=postgres --password=your_password --database=postgres
npm run videos:group -- --user=postgres --password=your_password --database=postgres
npm run videos:top -- --top=5 --user=postgres --password=your_password --database=postgres
```
