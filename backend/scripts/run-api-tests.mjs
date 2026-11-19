import { spawnSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const databaseName = `.luminasaber-test-${process.pid}.sqlite`;
const databasePath = path.resolve(backendDirectory, databaseName);
const expectedPrefix = `.luminasaber-test-${process.pid}.sqlite`;

if (path.dirname(databasePath) !== backendDirectory || path.basename(databasePath) !== expectedPrefix) {
  throw new Error('Caminho do banco de testes fora do diretório temporário esperado.');
}

if (existsSync(databasePath)) {
  throw new Error(`O banco temporário já existe; para evitar sobrescrever dados, o teste foi cancelado: ${databasePath}`);
}

const env = {
  ...process.env,
  DATABASE_URL: `file:./${databaseName}`,
  JWT_SECRET: 'luminasaber-test-secret-at-least-32-characters',
  NODE_ENV: 'test',
};

function runNode(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: backendDirectory,
    env,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`Comando de preparação/teste terminou com código ${result.status ?? 'desconhecido'}.`);
  }
}

try {
  runNode(['node_modules/prisma/build/index.js', 'generate']);
  runNode(['node_modules/prisma/build/index.js', 'migrate', 'deploy']);
  runNode(['--import', 'tsx', '--test', 'src/__tests__/api.test.ts']);
} finally {
  for (const suffix of ['', '-journal', '-shm', '-wal']) {
    rmSync(`${databasePath}${suffix}`, { force: true });
  }
}
