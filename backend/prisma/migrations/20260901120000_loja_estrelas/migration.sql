-- AlterTable
ALTER TABLE "USUARIO" ADD COLUMN "estrelas" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "compra" (
    "cod_compra" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cod_usuario" INTEGER NOT NULL,
    "item" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "custo" INTEGER NOT NULL,
    "data_compra" DATETIME NOT NULL,
    CONSTRAINT "compra_cod_usuario_fkey" FOREIGN KEY ("cod_usuario") REFERENCES "USUARIO" ("cod_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "inventario_beneficio" (
    "cod_usuario" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("cod_usuario", "tipo"),
    CONSTRAINT "inventario_beneficio_cod_usuario_fkey" FOREIGN KEY ("cod_usuario") REFERENCES "USUARIO" ("cod_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);