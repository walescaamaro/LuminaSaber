// Gera os arquivos usados por upload.http em backend/test-files/.
// Uso: npm run test:files
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const destino = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../test-files');
mkdirSync(destino, { recursive: true });

const PNG_1X1 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const GIF_1X1 = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const ASSINATURA_PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const arquivos = {
  // Imagens válidas (envio e reenvio).
  'valido.png': Buffer.from(PNG_1X1, 'base64'),
  'segundo.gif': Buffer.from(GIF_1X1, 'base64'),
  // 3 MB: acima do limite de 2 MB → 400.
  'grande.png': Buffer.concat([ASSINATURA_PNG, Buffer.alloc(3 * 1024 * 1024)]),
  // Tipo não permitido → 400.
  'documento.txt': Buffer.from('Isto não é uma imagem.\n'),
  // Diz ser PNG mas o conteúdo é texto → 400 (conferência da assinatura real).
  'falso.png': Buffer.from('Isto é texto disfarçado de PNG.\n'),
};

for (const [nome, conteudo] of Object.entries(arquivos)) {
  writeFileSync(path.join(destino, nome), conteudo);
  console.log(`✓ test-files/${nome} (${conteudo.length} bytes)`);
}