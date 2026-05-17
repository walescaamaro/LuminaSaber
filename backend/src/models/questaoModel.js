// src/models/questaoModel.js
// Camada Model: centraliza TODAS as operações SQL da entidade questao.
// Nenhuma regra de negócio ou lógica HTTP vive aqui — só SQL.

import db from '../database/database.js';

export const QuestaoModel = {

    // READ - listar todas (JOIN para trazer nome da matéria)
    async listarTodas() {
        const conn = await db.connect();
        const sql = `
            SELECT q.*, d.nome_disc AS materia
            FROM questao q
            JOIN disciplina d ON q.cod_disc = d.cod_disc
            ORDER BY d.nome_disc, q.cod_quest
        `;
        const resultados = await conn.all(sql);
        await conn.close();
        return resultados;
    },

    // READ - buscar por ID
    async buscarPorId(id) {
        const conn = await db.connect();
        const sql = `
            SELECT q.*, d.nome_disc AS materia
            FROM questao q
            JOIN disciplina d ON q.cod_disc = d.cod_disc
            WHERE q.cod_quest = ?
        `;
        const resultado = await conn.get(sql, [id]);
        await conn.close();
        return resultado; // undefined se não encontrado
    },

    // CREATE
    async criar(dados) {
        const conn = await db.connect();
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
            dados.alternativa_correta.toLowerCase(), // garante minúsculo no banco
            dados.dificuldade,
        ];
        const resultado = await conn.run(sql, params);
        await conn.close();
        return resultado.lastID;
    },

    // UPDATE parcial: só atualiza os campos que foram enviados
    async atualizar(id, dados) {
        const campos = [];
        const valores = [];

        if (dados.cod_disc !== undefined)            { campos.push('cod_disc = ?');            valores.push(dados.cod_disc); }
        if (dados.enunciado !== undefined)           { campos.push('enunciado = ?');            valores.push(dados.enunciado); }
        if (dados.alternativa_A !== undefined)       { campos.push('alternativa_A = ?');        valores.push(dados.alternativa_A); }
        if (dados.alternativa_B !== undefined)       { campos.push('alternativa_B = ?');        valores.push(dados.alternativa_B); }
        if (dados.alternativa_C !== undefined)       { campos.push('alternativa_C = ?');        valores.push(dados.alternativa_C); }
        if (dados.alternativa_D !== undefined)       { campos.push('alternativa_D = ?');        valores.push(dados.alternativa_D); }
        if (dados.alternativa_correta !== undefined) { campos.push('alternativa_correta = ?');  valores.push(dados.alternativa_correta.toLowerCase()); }
        if (dados.dificuldade !== undefined)         { campos.push('dificuldade = ?');           valores.push(dados.dificuldade); }

        if (campos.length === 0) return 0;

        valores.push(id); // cláusula WHERE
        const sql = `UPDATE questao SET ${campos.join(', ')} WHERE cod_quest = ?`;

        const conn = await db.connect();
        const resultado = await conn.run(sql, valores);
        await conn.close();
        return resultado.changes; // quantas linhas foram alteradas
    },

    // DELETE
    async deletar(id) {
        const conn = await db.connect();
        const resultado = await conn.run(
            'DELETE FROM questao WHERE cod_quest = ?', [id]
        );
        await conn.close();
        return resultado.changes; // 1 se deletou, 0 se não achou
    },
};