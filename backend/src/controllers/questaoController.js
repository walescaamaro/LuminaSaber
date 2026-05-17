import { QuestaoModel } from '../models/questaoModel.js';

// Transforma os dados do banco (que têm colunas A, B, C, D) no formato do seu frontend (array de alternativas)
const mapearParaFrontend = (q) => {
    const mapaLetraParaIndex = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
    return {
        id: q.cod_quest,
        materia: q.materia,
        nivel: q.dificuldade,
        enunciado: q.enunciado,
        alternativas: [q.alternativa_A, q.alternativa_B, q.alternativa_C, q.alternativa_D],
        correta: mapaLetraParaIndex[q.alternativa_correta] ?? 0
    };
};

export const QuestaoController = {
    async listar(req, res) {
        try {
            const questoesBanco = await QuestaoModel.listarTodas();
            const formatadas = questoesBanco.map(mapearParaFrontend);
            return res.status(200).json(formatadas);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao listar do banco' });
        }
    },

    async criar(req, res) {
        const { cod_disc, enunciado, alternativa_A, alternativa_B, alternativa_C, alternativa_D, alternativa_correta, dificuldade } = req.body;

        // Regra de negócio (Validação do Controller)
        if (!enunciado || !alternativa_correta) {
            return res.status(400).json({ error: 'Faltam dados obrigatórios' });
        }

        try {
            const novoId = await QuestaoModel.criar({
                cod_disc, enunciado, alternativa_A, alternativa_B, alternativa_C, alternativa_D, alternativa_correta, dificuldade
            });
            return res.status(201).json({ mensagem: 'Criado com sucesso!', id: novoId });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao salvar no banco' });
        }
    }
};