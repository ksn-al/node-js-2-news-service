<<<<<<< HEAD
var x = 5
console.log(x)
=======
const fileDB = require('./src/fileDB');

const newspostSchema = {
  id: Number,
  title: String,
  text: String,
  createDate: Date,
};

fileDB.registerSchema('newspost', newspostSchema);

const newspostTable = fileDB.getTable('newspost');

console.log('ALL (start):', newspostTable.getAll());

const created = newspostTable.create({
  title: 'Second Post',
  text: 'Hello again',
  hackerField: 123, // not in schema, should be ignored
});

console.log('CREATED:', created);

console.log('BY ID:', newspostTable.getById(created.id));

const updated = newspostTable.update(created.id, {
  title: 'Updated title',
  id: 999,          // should be ignored
  extra: 'nope',    //  should be ignored
});

console.log('UPDATED:', updated);

const deletedId = newspostTable.delete(created.id);
console.log('DELETED ID:', deletedId);

console.log('ALL (end):', newspostTable.getAll());
>>>>>>> 1d0e32e (feat: implement fileDB module with schema-based CRUD)
