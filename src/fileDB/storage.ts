import * as fs from 'fs';
import * as path from 'path';
import { Database } from './types';

const dbPath = path.join(__dirname, '../../db/db.json');

export function readDB(): Database {
  try {
    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data) as Database;
  } catch {
    return {};
  }
}

export function writeDB(data: Database): void {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(dbPath, jsonData, 'utf-8');
}
