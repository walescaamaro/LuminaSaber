/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `USUARIO` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "USUARIO_senha_key";

-- CreateIndex
CREATE UNIQUE INDEX "USUARIO_email_key" ON "USUARIO"("email");
