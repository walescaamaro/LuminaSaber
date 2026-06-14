-- CreateTable
CREATE TABLE "USUARIO" (
    "cod_usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "grau_escolar" TEXT,
    "data_nasc" DATETIME NOT NULL,
    "tipo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "disciplina" (
    "cod_disc" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_disc" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "suporte" (
    "cod_suporte" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "tipo_problema" TEXT NOT NULL,
    "descricao" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "relatorio" (
    "cod_relatorio" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "meta" INTEGER NOT NULL,
    "total_acertos" INTEGER NOT NULL,
    "percentual_acertos" INTEGER NOT NULL,
    "pontos_fortes" TEXT NOT NULL,
    "areas_melhorias" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PASTA" (
    "cod_pasta" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cod_usuario" INTEGER,
    "data_criacao" DATETIME NOT NULL,
    "nome_pasta" TEXT NOT NULL,
    CONSTRAINT "PASTA_cod_usuario_fkey" FOREIGN KEY ("cod_usuario") REFERENCES "USUARIO" ("cod_usuario") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "questao" (
    "cod_quest" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cod_disc" INTEGER NOT NULL,
    "enunciado" TEXT NOT NULL,
    "alternativa_A" TEXT NOT NULL,
    "alternativa_B" TEXT NOT NULL,
    "alternativa_C" TEXT NOT NULL,
    "alternativa_D" TEXT NOT NULL,
    "alternativa_correta" TEXT NOT NULL,
    "dificuldade" TEXT NOT NULL,
    CONSTRAINT "questao_cod_disc_fkey" FOREIGN KEY ("cod_disc") REFERENCES "disciplina" ("cod_disc") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "conteudo" (
    "cod_conteudo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cod_disc" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    CONSTRAINT "conteudo_cod_disc_fkey" FOREIGN KEY ("cod_disc") REFERENCES "disciplina" ("cod_disc") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "estuda" (
    "cod_usuario" INTEGER NOT NULL,
    "cod_disc" INTEGER NOT NULL,
    "meta" INTEGER NOT NULL,
    "tempo" TEXT NOT NULL,

    PRIMARY KEY ("cod_usuario", "cod_disc"),
    CONSTRAINT "estuda_cod_usuario_fkey" FOREIGN KEY ("cod_usuario") REFERENCES "USUARIO" ("cod_usuario") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "estuda_cod_disc_fkey" FOREIGN KEY ("cod_disc") REFERENCES "disciplina" ("cod_disc") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "historico" (
    "cod_resposta" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cod_usuario" INTEGER NOT NULL,
    "cod_quest" INTEGER NOT NULL,
    "data_resposta" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "historico_cod_usuario_fkey" FOREIGN KEY ("cod_usuario") REFERENCES "USUARIO" ("cod_usuario") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "historico_cod_quest_fkey" FOREIGN KEY ("cod_quest") REFERENCES "questao" ("cod_quest") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "anotacao" (
    "cod_anota" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cod_pasta" INTEGER NOT NULL,
    "cod_usuario" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "texto_anota" TEXT NOT NULL,
    "data_anota" DATETIME NOT NULL,
    CONSTRAINT "anotacao_cod_pasta_fkey" FOREIGN KEY ("cod_pasta") REFERENCES "PASTA" ("cod_pasta") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "anotacao_cod_usuario_fkey" FOREIGN KEY ("cod_usuario") REFERENCES "USUARIO" ("cod_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "contem" (
    "cod_pasta" INTEGER NOT NULL,
    "cod_anota" INTEGER NOT NULL,

    PRIMARY KEY ("cod_pasta", "cod_anota"),
    CONSTRAINT "contem_cod_pasta_fkey" FOREIGN KEY ("cod_pasta") REFERENCES "PASTA" ("cod_pasta") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "contem_cod_anota_fkey" FOREIGN KEY ("cod_anota") REFERENCES "anotacao" ("cod_anota") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "possui" (
    "cod_quest" INTEGER NOT NULL,
    "cod_resposta" INTEGER NOT NULL,

    PRIMARY KEY ("cod_quest", "cod_resposta"),
    CONSTRAINT "possui_cod_quest_fkey" FOREIGN KEY ("cod_quest") REFERENCES "questao" ("cod_quest") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "possui_cod_resposta_fkey" FOREIGN KEY ("cod_resposta") REFERENCES "historico" ("cod_resposta") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "USUARIO_senha_key" ON "USUARIO"("senha");
