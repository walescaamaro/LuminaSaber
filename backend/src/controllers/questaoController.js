// src/controllers/questaoController.js
// Camada Controller: recebe requisições HTTP, valida dados,
// chama o Model e devolve a resposta adequada ao cliente.

import { QuestaoModel } from '../models/questaoModel.js';

// Transforma linha do banco no formato que o frontend espera
const mapearParaFrontend = (q) => {
    // alternativa_correta é MINÚSCULA no banco ('a','b','c','d')
    const mapaLetraParaIndex = { 'a': 0, 'b': 1, 'c': 2, 'd': 3 };
    return {
        id:           q.cod_quest,
        materia:      q.materia,       // vem do JOIN com disciplina
        nivel:        q.dificuldade,
        enunciado:    q.enunciado,
        alternativas: [
            q.alternativa_A,
            q.alternativa_B,
            q.alternativa_C,
            q.alternativa_D,
        ],
        correta: mapaLetraParaIndex[q.alternativa_correta] ?? 0,
    };
};

const CAMPOS_OBRIGATORIOS = [
    'cod_disc', 'enunciado',
    'alternativa_A', 'alternativa_B', 'alternativa_C', 'alternativa_D',
    'alternativa_correta', 'dificuldade',
];

const LETRAS_VALIDAS = ['a', 'b', 'c', 'd'];

export const QuestaoController = {

    // GET /api/questoes
    async listar(req, res) {
        try {
            const questoesBanco = await QuestaoModel.listarTodas();
            const formatadas = questoesBanco.map(mapearParaFrontend);
            return res.status(200).json(formatadas);
        } catch (error) {
            console.error('Erro ao listar questões:', error);
            return res.status(500).json({ error: 'Erro interno ao listar questões.' });
        }
    },

    // GET /api/questoes/:id
    async buscarPorId(req, res) {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID deve ser um número inteiro.' });
        }

        try {
            const questao = await QuestaoModel.buscarPorId(Number(id));
            if (!questao) {
                return res.status(404).json({ error: `Questão com ID ${id} não encontrada.` });
            }
            return res.status(200).json(mapearParaFrontend(questao));
        } catch (error) {
            console.error('Erro ao buscar questão:', error);
            return res.status(500).json({ error: 'Erro interno ao buscar questão.' });
        }
    },

    // POST /api/questoes
    async criar(req, res) {
        const dados = req.body;

        const faltando = CAMPOS_OBRIGATORIOS.filter(campo => !dados[campo]);
        if (faltando.length > 0) {
            return res.status(400).json({
                error: `Campos obrigatórios ausentes: ${faltando.join(', ')}`,
            });
        }

        if (!LETRAS_VALIDAS.includes(dados.alternativa_correta.toLowerCase())) {
            return res.status(400).json({
                error: 'alternativa_correta deve ser uma das letras: a, b, c ou d.',
            });
        }

        try {
            const novoId = await QuestaoModel.criar(dados);
            return res.status(201).json({ mensagem: 'Questão criada com sucesso!', id: novoId });
        } catch (error) {
            console.error('Erro ao criar questão:', error);
            return res.status(500).json({ error: 'Erro interno ao criar questão.' });
        }
    },

    // PUT /api/questoes/:id
    async atualizar(req, res) {
        const { id } = req.params;
        const dados = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID deve ser um número inteiro.' });
        }

        const camposEditaveis = [
            'cod_disc', 'enunciado',
            'alternativa_A', 'alternativa_B', 'alternativa_C', 'alternativa_D',
            'alternativa_correta', 'dificuldade',
        ];
        const temAlgumCampo = camposEditaveis.some(c => dados[c] !== undefined);
        if (!temAlgumCampo) {
            return res.status(400).json({ error: 'Envie ao menos um campo para atualizar.' });
        }

        if (dados.alternativa_correta &&
            !LETRAS_VALIDAS.includes(dados.alternativa_correta.toLowerCase())) {
            return res.status(400).json({ error: 'alternativa_correta deve ser: a, b, c ou d.' });
        }

        try {
            const alteracoes = await QuestaoModel.atualizar(Number(id), dados);
            if (alteracoes === 0) {
                return res.status(404).json({ error: `Questão com ID ${id} não encontrada.` });
            }
            return res.status(200).json({ mensagem: `Questão ${id} atualizada com sucesso!` });
        } catch (error) {
            console.error('Erro ao atualizar questão:', error);
            return res.status(500).json({ error: 'Erro interno ao atualizar questão.' });
        }
    },

    // DELETE /api/questoes/:id
    async deletar(req, res) {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID deve ser um número inteiro.' });
        }

        try {
            const alteracoes = await QuestaoModel.deletar(Number(id));
            if (alteracoes === 0) {
                return res.status(404).json({ error: `Questão com ID ${id} não encontrada.` });
            }
            return res.status(200).json({ mensagem: `Questão ${id} deletada com sucesso!` });
        } catch (error) {
            console.error('Erro ao deletar questão:', error);
            return res.status(500).json({ error: 'Erro interno ao deletar questão.' });
        }
    },
};