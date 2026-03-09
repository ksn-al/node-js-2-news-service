import * as fileDB from './fileDB';
import { Newspost } from './fileDB/types';

/**
 * Тестування модуля FileDB на TypeScript
 */

// Визначаємо схему для таблиці newspost
const newspostSchema = {
  id: Number,
  title: String,
  text: String,
  createDate: Date,
};

// Регіструємо схему
fileDB.registerSchema('newspost', newspostSchema);

// Отримуємо об'єкт таблиці з підтримкою типу Newspost
const newspostTable = fileDB.getTable<Newspost>('newspost');

console.log('=== ТЕСТУВАННЯ FILEDB ===\n');

// === TEST: getAll() ===
console.log('1. Отримати всі записи (getAll):');
const allRecords = newspostTable.getAll();
console.log('ALL (start):', allRecords);
console.log('');

// === TEST: create() ===
console.log('2. Створити новий запис (create):');
const created = newspostTable.create({
  title: 'Second Post',
  text: 'Hello again',
  hackerField: 123 as any, // not in schema, should be ignored
});
console.log('CREATED:', created);
console.log('');

// === TEST: getById() ===
console.log('3. Отримати запис за id (getById):');
const byId = newspostTable.getById(created.id);
console.log('BY ID:', byId);
console.log('');

// === TEST: update() ===
console.log('4. Оновити запис (update):');
const updated = newspostTable.update(created.id, {
  title: 'Updated title',
  id: 999 as any, // should be ignored
  extra: 'nope' as any, // should be ignored
});
console.log('UPDATED:', updated);
console.log('');

// === TEST: delete() ===
console.log('5. Видалити запис (delete):');
const deletedId = newspostTable.delete(created.id);
console.log('DELETED ID:', deletedId);
console.log('');

// === TEST: getAll() after delete ===
console.log('6. Отримати всі записи після видалення (getAll):');
const allRecordsAfter = newspostTable.getAll();
console.log('ALL (end):', allRecordsAfter);
console.log('\n=== ТЕСТИ ЗАВЕРШЕНІ ===');
