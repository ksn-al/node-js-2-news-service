"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fileDB = __importStar(require("./fileDB"));
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
const newspostTable = fileDB.getTable('newspost');
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
    hackerField: 123, // not in schema, should be ignored
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
    id: 999, // should be ignored
    extra: 'nope', // should be ignored
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
//# sourceMappingURL=test.js.map