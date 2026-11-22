import test from 'node:test';
import assert from 'node:assert/strict';

import { createPromiseDatabase } from '../database/database.js';

test('adaptador SQLite encaminha parâmetros, normaliza resultados e fecha a conexão', async () => {
  const chamadas: Array<{ sql: string; params: unknown[] }> = [];
  let fechado = false;
  const database = {
    prepare(sql: string) {
      return {
        run(...params: unknown[]) {
          chamadas.push({ sql, params });
          return { changes: 2, lastInsertRowid: 9n };
        },
        get(...params: unknown[]) {
          chamadas.push({ sql, params });
          return sql === 'SELECT missing' ? undefined : { id: 1 };
        },
        all(...params: unknown[]) {
          chamadas.push({ sql, params });
          return [{ id: 1 }, { id: 2 }];
        },
      };
    },
    close() {
      fechado = true;
    },
  };

  const connection = createPromiseDatabase(database);
  assert.deepEqual(await connection.run('INSERT', ['a', 2]), { changes: 2, lastID: 9 });
  assert.deepEqual(await connection.get<{ id: number }>('SELECT one', 7), { id: 1 });
  assert.equal(await connection.get('SELECT missing'), undefined);
  assert.deepEqual(await connection.all<{ id: number }>('SELECT all'), [{ id: 1 }, { id: 2 }]);
  await connection.close();

  assert.deepEqual(chamadas, [
    { sql: 'INSERT', params: ['a', 2] },
    { sql: 'SELECT one', params: [7] },
    { sql: 'SELECT missing', params: [] },
    { sql: 'SELECT all', params: [] },
  ]);
  assert.equal(fechado, true);
});
