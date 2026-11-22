import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const resultado = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/run-e2e.ts'], {
  cwd: backendDirectory,
  env: process.env,
  stdio: 'inherit',
});

if (resultado.error) throw resultado.error;
if (resultado.status !== 0) {
  throw new Error(`Comando E2E terminou com código ${resultado.status ?? 'desconhecido'}.`);
}
