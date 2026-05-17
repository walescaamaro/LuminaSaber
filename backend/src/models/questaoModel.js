import db from '../database/database.js';

export const QuestaoModel = {
    // Traz as questões e faz o JOIN com a disciplina para pegar o nome da matéria
    async listarTodas() {
        const conn = await db.connect();
        const sql = `
            SELECT q.*, d.nome_disc AS materia 
            FROM questao q
            JOIN disciplina d ON q.cod_disc = d.cod_disc
        `;
        const resultados = await conn.all(sql);
        await conn.close();
        return resultados;
    },

    // Insere uma nova questão na sua tabela
    async criar(dados) {
        const conn = await db.connect();
        const sql = `
            INSERT INTO questao (cod_disc, enunciado, alternativa_A, alternativa_B, alternativa_C, alternativa_D, alternativa_correta, dificuldade)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            dados.cod_disc, dados.enunciado, dados.alternativa_A, 
            dados.alternativa_B, dados.alternativa_C, dados.alternativa_D, 
            dados.alternativa_correta, dados.dificuldade
        ];
        
        const resultado = await conn.run(sql, params);
        await conn.close();
        return resultado.lastID; // Retorna o ID (AUTOINCREMENT) da questão criada
    }
};