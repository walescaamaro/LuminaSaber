// migration.js
// Responsável por criar a estrutura do banco de dados.
// Execute com: npm run migrate
// "IF NOT EXISTS" torna o script idempotente (seguro de rodar mais de uma vez).

import db from './database.js';

async function runMigration() {
    console.log('▶ Iniciando migration...');
    const conn = await db.connect();

    await conn.run('PRAGMA foreign_keys = ON');

    await conn.run(`
        CREATE TABLE IF NOT EXISTS USUARIO (
            cod_usuario  INTEGER      PRIMARY KEY AUTOINCREMENT,
            nome         VARCHAR(40)  NOT NULL,
            email        VARCHAR(100) NOT NULL,
            senha        VARCHAR(20)  UNIQUE NOT NULL,
            grau_escolar VARCHAR(70),
            data_nasc    DATE         NOT NULL,
            tipo         TEXT         NOT NULL CHECK (tipo IN ('administrador', 'aluno')),
            CHECK (
                (tipo = 'aluno' AND grau_escolar IS NOT NULL) OR
                (tipo = 'administrador')
            )
        )
    `);
    console.log('  ✓ Tabela USUARIO');

    await conn.run(`
        CREATE TABLE IF NOT EXISTS disciplina (
            cod_disc  INTEGER     PRIMARY KEY AUTOINCREMENT,
            nome_disc VARCHAR(50) NOT NULL
        )
    `);
    console.log('  ✓ Tabela disciplina');

    await conn.run(`
        CREATE TABLE IF NOT EXISTS suporte (
            cod_suporte   INTEGER      PRIMARY KEY AUTOINCREMENT,
            email         VARCHAR(100) NOT NULL,
            tipo_problema VARCHAR(40)  NOT NULL,
            descricao     TEXT         NOT NULL
        )
    `);
    console.log('  ✓ Tabela suporte');

    await conn.run(`
        CREATE TABLE IF NOT EXISTS relatorio (
            cod_relatorio      INTEGER      PRIMARY KEY AUTOINCREMENT,
            meta               INTEGER      NOT NULL,
            total_acertos      INTEGER      NOT NULL,
            percentual_acertos INTEGER      NOT NULL,
            pontos_fortes      VARCHAR(100) NOT NULL,
            areas_melhorias    VARCHAR(100) NOT NULL
        )
    `);
    console.log('  ✓ Tabela relatorio');

    await conn.run(`
        CREATE TABLE IF NOT EXISTS PASTA (
            cod_pasta    INTEGER      PRIMARY KEY AUTOINCREMENT,
            cod_usuario  INTEGER      REFERENCES USUARIO(cod_usuario),
            data_criacao DATE         NOT NULL,
            nome_pasta   VARCHAR(100) NOT NULL
        )
    `);
    console.log('  ✓ Tabela PASTA');

    await conn.run(`
        CREATE TABLE IF NOT EXISTS questao (
            cod_quest           INTEGER      PRIMARY KEY AUTOINCREMENT,
            cod_disc            INTEGER      NOT NULL,
            enunciado           VARCHAR(700) NOT NULL,
            alternativa_A       VARCHAR(100) NOT NULL,
            alternativa_B       VARCHAR(100) NOT NULL,
            alternativa_C       VARCHAR(100) NOT NULL,
            alternativa_D       VARCHAR(100) NOT NULL,
            alternativa_correta CHAR(1)      NOT NULL CHECK (alternativa_correta IN ('a','b','c','d')),
            dificuldade         VARCHAR(20)  NOT NULL,
            FOREIGN KEY (cod_disc) REFERENCES disciplina(cod_disc)
        )
    `);
    console.log('  ✓ Tabela questao');

    await conn.run(`
        CREATE TABLE IF NOT EXISTS conteudo (
            cod_conteudo INTEGER     PRIMARY KEY AUTOINCREMENT,
            cod_disc     INTEGER     NOT NULL,
            descricao    VARCHAR(70) NOT NULL,
            FOREIGN KEY (cod_disc) REFERENCES disciplina(cod_disc)
        )
    `);
    console.log('  ✓ Tabela conteudo');

    await conn.run(`
        CREATE TABLE IF NOT EXISTS estuda (
            cod_usuario INTEGER NOT NULL,
            cod_disc    INTEGER NOT NULL,
            meta        INTEGER NOT NULL,
            tempo       TEXT    NOT NULL,
            PRIMARY KEY (cod_usuario, cod_disc),
            FOREIGN KEY (cod_usuario) REFERENCES USUARIO(cod_usuario),
            FOREIGN KEY (cod_disc)    REFERENCES disciplina(cod_disc)
        )
    `);
    console.log('  ✓ Tabela estuda');

    await conn.run(`
        CREATE TABLE IF NOT EXISTS historico (
            cod_resposta  INTEGER     PRIMARY KEY AUTOINCREMENT,
            cod_usuario   INTEGER     NOT NULL,
            cod_quest     INTEGER     NOT NULL,
            data_resposta DATE        NOT NULL,
            status        VARCHAR(20) NOT NULL,
            FOREIGN KEY (cod_usuario) REFERENCES USUARIO(cod_usuario),
            FOREIGN KEY (cod_quest)   REFERENCES questao(cod_quest)
        )
    `);
    console.log('  ✓ Tabela historico');

    await conn.run(`
        CREATE TABLE IF NOT EXISTS anotacao (
            cod_anota   INTEGER      PRIMARY KEY AUTOINCREMENT,
            cod_pasta   INTEGER      NOT NULL,
            cod_usuario INTEGER      NOT NULL,
            titulo      VARCHAR(100) NOT NULL,
            texto_anota TEXT         NOT NULL,
            data_anota  DATE         NOT NULL,
            FOREIGN KEY (cod_pasta)   REFERENCES PASTA(cod_pasta),
            FOREIGN KEY (cod_usuario) REFERENCES USUARIO(cod_usuario)
        )
    `);
    console.log('  ✓ Tabela anotacao');

    await conn.run(`
    CREATE TABLE IF NOT EXISTS contem (
        cod_pasta  INTEGER NOT NULL,
        cod_anota  INTEGER NOT NULL,
        PRIMARY KEY (cod_pasta, cod_anota),
        FOREIGN KEY (cod_pasta) REFERENCES PASTA(cod_pasta),
        FOREIGN KEY (cod_anota) REFERENCES anotacao(cod_anota)
    )
`);
    console.log('  ✓ Tabela contem');

    await conn.run(`
        CREATE TABLE IF NOT EXISTS possui (
            cod_quest    INTEGER NOT NULL,
            cod_resposta INTEGER NOT NULL,
            PRIMARY KEY (cod_quest, cod_resposta),
            FOREIGN KEY (cod_quest)    REFERENCES questao(cod_quest),
            FOREIGN KEY (cod_resposta) REFERENCES historico(cod_resposta)
        )
    `);
    console.log('  ✓ Tabela possui');

    await conn.close();
    console.log('✅ Migration concluída com sucesso!');
}

runMigration().catch((err) => {
    console.error('❌ Erro na migration:', err);
    process.exit(1);
});
