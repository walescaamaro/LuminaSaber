import db from '../database/database.js';
import type { QuestaoBanco, QuestaoPayload } from '../types/questao.js';

export const QuestaoModel = {
  async listarTodas(): Promise<QuestaoBanco[]> {
    const conn = await db.connect();
    const sql = `
            SELECT q.*, d.nome_disc AS materia
            FROM questao q
            JOIN disciplina d ON q.cod_disc = d.cod_disc
            ORDER BY d.nome_disc, q.cod_quest
        `;
    const resultados = await conn.all<QuestaoBanco>(sql);
    await conn.close();
    return resultados;
  },

  async buscarPorId(id: number): Promise<QuestaoBanco | undefined> {
    const conn = await db.connect();
    const sql = `
            SELECT q.*, d.nome_disc AS materia
            FROM questao q
            JOIN disciplina d ON q.cod_disc = d.cod_disc
            WHERE q.cod_quest = ?
        `;
    const resultado = await conn.get<QuestaoBanco>(sql, [id]);
    await conn.close();
    return resultado;
  },

  async criar(dados: QuestaoPayload): Promise<number> {
    const conn = await db.connect();

    const existe = await conn.get<{ cod_quest: number }>(
      'SELECT cod_quest FROM questao WHERE enunciado = ?',
      [dados.enunciado]
    );
    if (existe) {
      await conn.close();
      throw new Error('DUPLICADO');
    }

    const sql = `
            INSERT INTO questao
                (cod_disc, enunciado, alternativa_A, alternativa_B,
                 alternativa_C, alternativa_D, alternativa_correta, dificuldade)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
    const params = [
      dados.cod_disc,
      dados.enunciado,
      dados.alternativa_A,
      dados.alternativa_B,
      dados.alternativa_C,
      dados.alternativa_D,
      dados.alternativa_correta.toLowerCase(),
      dados.dificuldade,
    ];
    const resultado = await conn.run(sql, params);
    await conn.close();
    return resultado.lastID;
  },

  async atualizar(id: number, dados: Partial<QuestaoPayload>): Promise<number> {
    const campos: string[] = [];
    const valores: unknown[] = [];

    if (dados.cod_disc !== undefined) { campos.push('cod_disc = ?'); valores.push(dados.cod_disc); }
    if (dados.enunciado !== undefined) { campos.push('enunciado = ?'); valores.push(dados.enunciado); }
    if (dados.alternativa_A !== undefined) { campos.push('alternativa_A = ?'); valores.push(dados.alternativa_A); }
    if (dados.alternativa_B !== undefined) { campos.push('alternativa_B = ?'); valores.push(dados.alternativa_B); }
    if (dados.alternativa_C !== undefined) { campos.push('alternativa_C = ?'); valores.push(dados.alternativa_C); }
    if (dados.alternativa_D !== undefined) { campos.push('alternativa_D = ?'); valores.push(dados.alternativa_D); }
    if (dados.alternativa_correta !== undefined) {
      campos.push('alternativa_correta = ?');
      valores.push(dados.alternativa_correta.toLowerCase());
    }
    if (dados.dificuldade !== undefined) { campos.push('dificuldade = ?'); valores.push(dados.dificuldade); }

    if (campos.length === 0) {
      return 0;
    }

    valores.push(id);
    const sql = `UPDATE questao SET ${campos.join(', ')} WHERE cod_quest = ?`;

    const conn = await db.connect();
    const resultado = await conn.run(sql, valores);
    await conn.close();
    return resultado.changes;
  },

  async deletar(id: number): Promise<number> {
    const conn = await db.connect();
    const resultado = await conn.run('DELETE FROM questao WHERE cod_quest = ?', [id]);
    await conn.close();
    return resultado.changes;
  },
};
