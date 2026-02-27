const fs = require('fs');
const path = require('path');
console.log('storage loaded');

const dbPath = path.join(__dirname, '../../db/db.json');

function readDB() {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data);
}

function writeDB(data) {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(dbPath, jsonData, 'utf-8');
}

module.exports = { readDB, writeDB };