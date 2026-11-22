import { spawn, spawnSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Server } from 'node:http';
import { aplicarMigracoes } from './test-database.mjs';

const backendDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const databaseName = `.luminasaber-e2e-${process.pid}-${randomUUID()}.sqlite`;
const databasePath = path.resolve(backendDirectory, databaseName);
const expectedPrefix = `.luminasaber-e2e-${process.pid}-`;

if (path.dirname(databasePath) !== backendDirectory || !path.basename(databasePath).startsWith(expectedPrefix)) {
  throw new Error('Caminho do banco E2E fora do diretório temporário esperado.');
}
if (existsSync(databasePath)) {
  throw new Error(`O banco E2E já existe; para evitar sobrescrever dados, o teste foi cancelado: ${databasePath}`);
}

const env = {
  ...process.env,
  DATABASE_URL: `file:./${databaseName}`,
  JWT_SECRET: 'luminasaber-e2e-secret-at-least-32-characters',
  NODE_ENV: 'test',
};
let servidor: Server | undefined;
let desconectarPrisma: (() => Promise<void>) | undefined;

function executar(args: string[], environment: NodeJS.ProcessEnv) {
  const resultado = spawnSync(process.execPath, args, {
    cwd: backendDirectory,
    env: environment,
    stdio: 'inherit',
  });
  if (resultado.error) throw resultado.error;
  if (resultado.status !== 0) {
    throw new Error(`Comando E2E terminou com código ${resultado.status ?? 'desconhecido'}.`);
  }
}

function executarAssincrono(args: string[], environment: NodeJS.ProcessEnv): Promise<void> {
  return new Promise((resolve, reject) => {
    const processo = spawn(process.execPath, args, {
      cwd: backendDirectory,
      env: environment,
      stdio: 'inherit',
    });
    processo.once('error', reject);
    processo.once('exit', (codigo, sinal) => {
      if (codigo === 0) resolve();
      else reject(new Error(`Comando E2E terminou com código ${codigo ?? sinal ?? 'desconhecido'}.`));
    });
  });
}

try {
  process.env.DATABASE_URL = env.DATABASE_URL;
  process.env.JWT_SECRET = env.JWT_SECRET;
  process.env.NODE_ENV = env.NODE_ENV;
  executar(['node_modules/prisma/build/index.js', 'generate'], env);
  aplicarMigracoes(databasePath);

  const [{ default: app }, { prisma }] = await Promise.all([
    import('../app.js'),
    import('../src/lib/prisma.js'),
  ]);
  desconectarPrisma = () => prisma.$disconnect();
  servidor = await new Promise<Server>((resolve, reject) => {
    const novoServidor = app.listen(0, '127.0.0.1', () => resolve(novoServidor));
    novoServidor.once('error', reject);
  });
  const endereco = servidor.address();
  if (!endereco || typeof endereco === 'string') throw new Error('Servidor E2E não informou sua porta.');
  const baseURL = `http://127.0.0.1:${endereco.port}`;

  await executarAssincrono(['node_modules/@playwright/test/cli.js', 'test'], {
    ...env,
    PORT: String(endereco.port),
    BASE_URL: baseURL,
    E2E_SERVER_MANAGED: '1',
  });
} finally {
  if (servidor?.listening) {
    await new Promise<void>((resolve, reject) => {
      servidor?.close((erro) => erro ? reject(erro) : resolve());
    });
  }
  await desconectarPrisma?.();
  for (const suffix of ['', '-journal', '-shm', '-wal']) {
    rmSync(`${databasePath}${suffix}`, { force: true });
  }
}
