-- CreateTable
CREATE TABLE "password_reset_token" (
    "cod_token" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cod_usuario" INTEGER NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "usado_em" DATETIME,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "password_reset_token_cod_usuario_fkey" FOREIGN KEY ("cod_usuario") REFERENCES "USUARIO" ("cod_usuario") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_token_token_hash_key" ON "password_reset_token"("token_hash");
