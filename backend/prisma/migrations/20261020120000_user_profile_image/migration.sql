-- CreateTable
CREATE TABLE "imagem_perfil" (
	"cod_imagem" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"cod_usuario" INTEGER NOT NULL,
	"caminho" TEXT NOT NULL,
	"criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"atualizado_em" DATETIME NOT NULL,
	CONSTRAINT "imagem_perfil_cod_usuario_fkey" FOREIGN KEY ("cod_usuario") REFERENCES "USUARIO" ("cod_usuario") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "imagem_perfil_cod_usuario_key" ON "imagem_perfil"("cod_usuario");
