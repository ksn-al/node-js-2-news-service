# FileDB на TypeScript

 ДЗ2 на TypeScript.

## Що зробила
- Переписала модуль `fileDB` з JS на TS.
- Проставила типи для методів і повернення значень.
- Додала тип для новини: `Newspost` (`src/fileDB/types.ts`).

## Файли
- `src/fileDB/index.ts` - вхід у модуль.
- `src/fileDB/schema.ts` - реєстрація і отримання схем.
- `src/fileDB/storage.ts` - читання/запис в `db/db.json`.
- `src/fileDB/tableFactory.ts` - CRUD-методи таблиці.
- `src/fileDB/types.ts` - всі основні типи.

## Як використовується таблиця
```ts
const newspostTable = fileDB.getTable<Newspost>('newspost');

const newsposts = newspostTable.getAll();
const newspost = newspostTable.getById(id);

const createdNewspost = newspostTable.create({
  title: 'У зоопарку Чернігова лисичка народила лисеня',
  text: '...'
});

const updatedNewspost = newspostTable.update(id, {
  title: 'Маленька лисичка'
});

const deletedId = newspostTable.delete(id);
```

## Патерни
1. **Factory Method** — `tableFactory.ts`
`createTable()` створює таблицю з методами, а не через `new`.

2. **Singleton** — `schema.ts`
Реєстр схем один на весь модуль.

3. **Facade** — `index.ts`
Назовні тільки `registerSchema()` і `getTable()`.

## Чому TypeScript
Типи допомагають не помилятися, код стає зрозуміліший.

## Запуск
```bash
npm install
npm run build
npm run test
```
