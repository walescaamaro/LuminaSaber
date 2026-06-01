import { resolve } from 'node:path';
import Database from 'better-sqlite3';

const dbFile = resolve('src', 'database', 'db.sqlite');

type SqlParams = unknown | readonly unknown[];

interface SqliteRunResult {
  changes: number;
  lastInsertRowid: number;
}

export interface SqliteConnection {
  run(sql: string, params?: SqlParams): Promise<{ changes: number; lastID: number }>;
  get<T = unknown>(sql: string, params?: SqlParams): Promise<T | undefined>;
  all<T = unknown>(sql: string, params?: SqlParams): Promise<T[]>;
  close(): Promise<void>;
}

function parseParams(params: SqlParams = []): unknown[] {
  return Array.isArray(params) ? params : [params];
}

function parseRow<T>(row: T | undefined): T | undefined {
  return row ? { ...row } : undefined;
}

function createPromiseDatabase(database: any): SqliteConnection {
  return {
    async run(sql, params) {
      const result = database.prepare(sql).run(...parseParams(params));
      return {
        changes: result.changes,
        lastID: Number(result.lastInsertRowid),
      };
    },

    async get(sql, params) {
      return parseRow(database.prepare(sql).get(...parseParams(params)));
    },

    async all(sql, params) {
      return database.prepare(sql).all(...parseParams(params)).map(parseRow);
    },

    async close() {
      database.close();
    },
  };
}

export async function connect(): Promise<SqliteConnection> {
  return createPromiseDatabase(new Database(dbFile, { readonly: false }));
}

export default { connect };
