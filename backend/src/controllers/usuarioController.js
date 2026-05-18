import db from '../database/database.js';

export const UsuarioController = {

    async criar(req, res) {
        const { nome, email, senha, grau_escolar, data_nasc, tipo } = req.body;

        // Campos obrigatórios para todos
        if (!nome || !email || !senha || !data_nasc || !tipo) {
            return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
        }

        if (!['administrador', 'aluno'].includes(tipo)) {
            return res.status(400).json({ error: 'Tipo deve ser "administrador" ou "aluno".' });
        }

        // grau_escolar obrigatório para aluno
        if (tipo === 'aluno' && !grau_escolar) {
            return res.status(400).json({ error: 'Alunos devem informar o grau escolar.' });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'E-mail inválido.' });
        }

        try {
            const conn = await db.connect();

            // Verifica e-mail duplicado
            const emailExiste = await conn.get('SELECT cod_usuario FROM USUARIO WHERE email = ?', [email]);
            if (emailExiste) {
                await conn.close();
                return res.status(409).json({ error: 'Este e-mail já está cadastrado. Use outro e-mail.' });
            }

            // Verifica senha já usada por outro usuário
            const senhaExiste = await conn.get('SELECT cod_usuario FROM USUARIO WHERE senha = ?', [senha]);
            if (senhaExiste) {
                await conn.close();
                return res.status(409).json({ error: 'Esta senha já está em uso. Por favor, escolha uma senha diferente.' });
            }

            const resultado = await conn.run(
                `INSERT INTO USUARIO (nome, email, senha, grau_escolar, data_nasc, tipo)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [nome, email, senha, grau_escolar || null, data_nasc, tipo]
            );
            await conn.close();

            return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', id: resultado.lastID });
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            return res.status(500).json({ error: 'Erro interno ao cadastrar usuário.' });
        }
    },

    async listar(req, res) {
        try {
            const conn = await db.connect();
            const usuarios = await conn.all('SELECT cod_usuario, nome, email, grau_escolar, data_nasc, tipo FROM USUARIO');
            await conn.close();
            return res.status(200).json(usuarios);
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            return res.status(500).json({ error: 'Erro interno ao listar usuários.' });
        }
    }
};