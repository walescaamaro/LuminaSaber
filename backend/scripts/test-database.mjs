import Database from 'better-sqlite3';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const migrationsDirectory = path.join(backendDirectory, 'prisma', 'migrations');

export function aplicarMigracoes(databasePath) {
  const database = new Database(databasePath);
  try {
    const migrations = readdirSync(migrationsDirectory, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    for (const migration of migrations) {
      const migrationPath = path.join(migrationsDirectory, migration, 'migration.sql');
      database.exec(readFileSync(migrationPath, 'utf8'));
    }
  } finally {
    database.close();
  }
}
