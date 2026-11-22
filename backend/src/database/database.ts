import { resolve } from 'node:path';
import Database from 'better-sqlite3';

const dbFile = resolve('src', 'database', 'db.sqlite');

type SqlParams = unknown | readonly unknown[];

interface SqliteRunResult {
  changes: number;
  lastInsertRowid: number | bigint;
}

interface SqliteStatementLike {
  run(...params: unknown[]): SqliteRunResult;
  get(...params: unknown[]): unknown;
  all(...params: unknown[]): unknown[];
}

interface SqliteDatabaseLike {
  prepare(sql: string): SqliteStatementLike;
  close(): void;
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

export function createPromiseDatabase(database: SqliteDatabaseLike): SqliteConnection {
  return {
    async run(sql, params) {
      const result = database.prepare(sql).run(...parseParams(params));
      return {
        changes: result.changes,
        lastID: Number(result.lastInsertRowid),
      };
    },

    async get<T = unknown>(sql: string, params?: SqlParams) {
      return parseRow(database.prepare(sql).get(...parseParams(params)) as T | undefined);
    },

    async all<T = unknown>(sql: string, params?: SqlParams) {
      return (database.prepare(sql).all(...parseParams(params)) as T[]).map((row) => parseRow(row) as T);
    },

    async close() {
      database.close();
    },
  };
}

export async function connect(): Promise<SqliteConnection> {
  return createPromiseDatabase(new Database(dbFile, { readonly: false }) as unknown as SqliteDatabaseLike);
}

export default { connect };
