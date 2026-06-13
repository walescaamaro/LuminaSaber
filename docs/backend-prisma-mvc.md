# Backend: Prisma, ERD e MVC

## Modelagem do Banco de Dados

A modelagem principal está em `prisma/schema.prisma`, usando SQLite como banco. O schema define entidades da aplicação, seus atributos, chaves primárias, chaves estrangeiras e relacionamentos.

Principais models:

- `Usuario`: representa alunos e administradores. A chave primária é `cod_usuario`, com autoincremento. Possui `nome`, `email`, `senha`, `grau_escolar`, `data_nasc` e `tipo`, que usa o enum `Tipo` (`administrador` ou `aluno`). Relaciona-se com `Pasta`, `Historico`, `Anotacao` e `Estuda`.
- `Disciplina`: representa as matérias disponíveis. A chave primária é `cod_disc`. Relaciona-se com `Questao`, `Conteudo` e `Estuda`.
- `Questao`: representa exercícios de múltipla escolha. A chave primária é `cod_quest`. A chave estrangeira `cod_disc` referencia `Disciplina.cod_disc`, criando o relacionamento em que uma disciplina possui várias questões.
- `Historico`: registra respostas de usuários. A chave primária é `cod_resposta`; `cod_usuario` referencia `Usuario` e `cod_quest` referencia `Questao`.
- `Pasta` e `Anotacao`: organizam anotações dos usuários. `Pasta.cod_usuario` referencia `Usuario`; `Anotacao.cod_pasta` referencia `Pasta` e `Anotacao.cod_usuario` referencia `Usuario`.
- `Estuda`, `Contem` e `Possui`: tabelas associativas com chave primária composta, usadas para representar relacionamentos N:N.

Exemplo de relacionamento:

`Disciplina 1:N Questao`: cada questão pertence a uma disciplina por meio da FK `Questao.cod_disc`, e uma disciplina pode conter várias questões.

O diagrama ERD obrigatório está disponível em:

- `docs/erd.mmd`: versão Mermaid editável.
- `docs/erd.png`: imagem do diagrama ERD.

## MVC com Express, Prisma Client e SQLite

O backend usa uma separação em MVC:

- Rotas: arquivos em `backend/src/routes`. Elas definem os endpoints HTTP, como `GET /api/questoes`, `POST /api/questoes`, `PUT /api/questoes/:id` e `DELETE /api/questoes/:id`.
- Controllers: arquivos em `backend/src/controllers`. Eles recebem `Request` e `Response`, validam parâmetros e corpo da requisição, tratam mensagens de erro e retornam respostas HTTP adequadas.
- Models: arquivos em `backend/src/models`. Eles centralizam o acesso ao banco usando Prisma Client, evitando SQL espalhado pelos Controllers.

O Prisma Client é configurado em `backend/src/lib/prisma.ts` e usa o SQLite em `backend/src/database/db.sqlite`.

CRUD implementado:

- Create: `QuestaoModel.criar` usa `prisma.questao.create`; `UsuarioModel.criar` usa `prisma.usuario.create`.
- Read: `QuestaoModel.listarTodas`, `QuestaoModel.buscarPorId` e `UsuarioModel.listar` usam `findMany`, `findUnique` e `findFirst`.
- Update: `QuestaoModel.atualizar` usa `prisma.questao.update`.
- Delete: `QuestaoModel.deletar` usa `prisma.questao.delete`.

Os Controllers mantêm validações de campos obrigatórios, IDs numéricos, alternativas válidas, duplicidade de questão, e-mails/senhas já cadastrados e respostas HTTP como `200`, `201`, `400`, `404` e `409`.
