<div align="center">

# 🌟 LuminaSaber

### Plataforma web gamificada e gratuita de apoio ao aprendizado na educação básica

</div>

---

## 📖 1. Visão geral do sistema

**Objetivo do sistema:** o LuminaSaber é uma plataforma web destinada ao **apoio ao estudo de estudantes da educação básica** (do jardim de infância ao 9º ano), permitindo cadastro e resolução de questões de múltipla escolha, definição de metas de estudo e geração de relatórios de desempenho com análise personalizada por IA.

**Público-alvo:** estudantes da educação básica que buscam praticar conteúdos por disciplina de forma gratuita e gamificada, e administradores responsáveis por cadastrar e manter o banco de questões.

**Principais funcionalidades:**
- Cadastro de usuários (aluno ou administrador);
- Seleção de disciplina, tempo de estudo e meta de questões;
- Resolução de exercícios de múltipla escolha com busca e filtro por matéria;
- Relatório de desempenho com pontos fortes e áreas de melhoria gerados por IA, citando exatamente os temas que o aluno acertou e errou;
- CRUD completo de questões pelo painel administrativo.

O projeto foi originalmente desenvolvido para a disciplina de **Projeto Integrador**, já concluída, e atualmente segue em desenvolvimento como atividade da disciplina de **Linguagem e Técnicas de Programação II** do **Instituto Federal de Educação, Ciência e Tecnologia da Paraíba (IFPB)**, com foco na integração entre **front-end**, **back-end (Node.js/Express + TypeScript)** e **banco de dados relacional (SQLite)** via **Prisma ORM**.

### 👩‍💻 Equipe

| Nome | Matrícula |
|------|-----------|
| Walesca Amaro Rodrigues | 20241780019 |
| Rayssa Priscila Silva Nascimento | 20241780013 |

---

## ✨ Funcionalidades e telas

| Tela | Rota | Descrição | Acesso |
|------|------|-----------|--------|
| 🏠 Home | `/` | Apresentação da plataforma | Público |
| 📝 Cadastro de usuário | `/cadastro` | Formulário de cadastro (aluno ou administrador) | Público |
| 📚 Seleção de disciplinas | `/selecao` | Escolha da disciplina a ser estudada | Usuário |
| ⏱️ Definição de tempo | `/tempo` | Definição do tempo de estudo | Usuário |
| 🎯 Meta de questões | `/meta` | Definição da meta de questões a responder | Usuário |
| ✏️ Exercícios | `/exercicios` | Resolução das questões, com filtros e busca | Usuário |
| 📊 Relatório | `/relatorio` | Desempenho, pontos fortes/fracos e análise por IA | Usuário |
| ⚙️ Cadastro de exercícios | `/cadastro-exercicios` | CRUD completo de questões | Administrador |

---

## 🖥️ 2. Demonstração da interface (CRUD)

A tela **Cadastro de Exercícios** (`/cadastro-exercicios`) é a principal demonstração de integração CRUD do projeto, cobrindo as quatro operações sobre a tabela `questao`:

| Operação | Como é feita na interface | Rota da API |
|----------|---------------------------|-------------|
| **Create** | Formulário cadastra uma nova questão | `POST /api/questoes` |
| **Read** | Tabela lista todas as questões cadastradas | `GET /api/questoes` |
| **Update** | Botão "Editar" carrega os dados no formulário e salva as alterações | `PUT /api/questoes/:id` |
| **Delete** | Botão "Excluir" remove a questão, com confirmação prévia | `DELETE /api/questoes/:id` |

**Como ocorre a comunicação entre interface e banco de dados:** o front-end (HTML/JS puro, sem framework) usa a `Fetch API` do navegador para enviar requisições HTTP à API REST do Express. O `Controller` valida os dados recebidos e delega ao `Model`, que executa a operação no banco através do **Prisma Client**. A resposta (JSON) volta para o front-end, que atualiza a tabela na tela **sem precisar recarregar a página**.

```
Front-end (fetch)  →  Routes  →  Controllers (validação)  →  Models (Prisma)  →  SQLite
                                         ↓
                                  resposta JSON (200/201/400/404/409)
```

A tela de **Exercícios** (`/exercicios`) também demonstra a leitura (`Read`) do lado do aluno: as questões são buscadas via `GET /api/questoes`, filtradas por disciplina no próprio navegador, e cada resposta do aluno é exibida na hora (✅ acertou / ❌ errou, com a alternativa correta).

---

## 💾 3. Persistência dos dados

Os dados são armazenados em um arquivo físico de banco de dados SQLite (`backend/src/database/db.sqlite`), e **não em memória** — por isso permanecem salvos mesmo após reiniciar o servidor ou o computador.

**Como confirmar a persistência na prática:**

1. Cadastre uma questão pela tela `/cadastro-exercicios` (ou um usuário pela tela `/cadastro`);
2. Pare o servidor (`Ctrl+C` no terminal);
3. Inicie o servidor novamente (`npm run dev`);
4. Acesse `/cadastro-exercicios` (ou a listagem correspondente) — o registro cadastrado continua lá.

**Visualizando a tabela diretamente no banco**, sem precisar passar pela interface:

```bash
npx prisma studio
```

Esse comando abre uma interface visual no navegador (`http://localhost:5555`) com todas as tabelas do banco. Basta clicar em `Questao` ou `Usuario` para ver os registros salvos, mesmo com o servidor principal desligado — prova de que o dado foi de fato persistido no SQLite e não apenas mantido na memória da aplicação.

---

## 🧪 4. Testes de integridade

Os testes abaixo, presentes em [`backend/request.http`](backend/request.http) (extensão **REST Client** do VSCode), comprovam que o sistema rejeita dados inconsistentes antes de qualquer escrita no banco:

| Teste | Cenário | Resultado esperado |
|-------|---------|---------------------|
| Campos obrigatórios vazios | `POST /api/questoes` sem `enunciado` ou sem alternativas | `400 Bad Request` — lista os campos ausentes |
| Dado inválido | `alternativa_correta` fora de `a`, `b`, `c`, `d` | `400 Bad Request` |
| ID malformado | `GET/PUT/DELETE /api/questoes/abc` (não numérico) | `400 Bad Request` |
| Registro inexistente | `GET/PUT/DELETE` com um ID que não existe no banco | `404 Not Found` |
| Cadastro duplicado | Repetir a mesma questão já cadastrada | `409 Conflict` |
| Atualização parcial | `PUT` sem nenhum campo no corpo da requisição | `400 Bad Request` — "envie ao menos um campo" |
| Atualização válida | `PUT` com um ou mais campos válidos | `200 OK` — questão atualizada |
| Exclusão válida | `DELETE` de um ID existente | `200 OK` — confirma remoção |

**Como o sistema evita inconsistências:** toda validação acontece na camada de **Controller**, antes de qualquer chamada ao banco — nenhuma query é executada com dados inválidos. IDs são convertidos e checados com `Number.isNaN`; campos obrigatórios são verificados em lista fixa (`CAMPOS_OBRIGATORIOS`); a letra da alternativa correta é normalizada e validada contra um conjunto fechado (`a/b/c/d`); e duplicidade é tratada como erro de negócio (`409`), não como falha genérica. Erros nunca retornam silenciosamente — todos passam por uma classe `HttpError` central, capturada por um middleware (`errorHandler`) que padroniza a resposta JSON de erro.

---

## 🗄️ 5. Estrutura do banco de dados

A modelagem está em [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma), com **12 models** representando as entidades do sistema, incluindo chaves primárias, chaves estrangeiras e relacionamentos 1:N e N:N.

<div align="center">
  <img src="docs/erd.png" alt="Diagrama ERD do LuminaSaber" width="100%" />
</div>

> Versão editável do diagrama (Mermaid): [`docs/erd.mmd`](docs/erd.mmd)

### Principais entidades

| Model | Descrição | Chave primária |
|-------|-----------|-----------------|
| `Usuario` | Alunos e administradores | `cod_usuario` |
| `Disciplina` | Matérias (Matemática, Português, etc.) | `cod_disc` |
| `Questao` | Questões de múltipla escolha (4 alternativas) | `cod_quest` |
| `Conteudo` | Tópicos/conteúdos de cada disciplina | `cod_conteudo` |
| `Pasta` | Pastas de anotações do usuário | `cod_pasta` |
| `Anotacao` | Anotações criadas pelo usuário | `cod_anota` |
| `Historico` | Registro de respostas (acertou/errou) | `cod_resposta` |
| `Relatorio` | Relatório de desempenho | `cod_relatorio` |
| `Suporte` | Solicitações de suporte/feedback | `cod_suporte` |
| `Estuda` | Associativa N:N entre `Usuario` e `Disciplina` (metas) | `cod_usuario` + `cod_disc` |
| `Contem` | Associativa N:N entre `Pasta` e `Anotacao` | `cod_pasta` + `cod_anota` |
| `Possui` | Associativa N:N entre `Questao` e `Historico` | `cod_quest` + `cod_resposta` |

### Exemplos de relacionamento

- **1:N** — Uma `Disciplina` possui várias `Questao` (`Questao.cod_disc → Disciplina.cod_disc`).
- **1:N** — Um `Usuario` pode criar várias `Pasta` e `Anotacao`.
- **N:N** — Um `Usuario` "estuda" várias `Disciplina` (e vice-versa), modelado pela tabela `Estuda`, que guarda também a meta e o tempo de estudo.
- **N:N** — Uma `Pasta` pode conter várias `Anotacao` (e uma anotação pode pertencer a mais de uma pasta), via `Contem`.

---

## 🧰 6. Documentação técnica

### Tecnologia utilizada

**Back-end:** Node.js + Express.js para o servidor HTTP e roteamento; TypeScript em modo `strict` para tipagem estática; Morgan como logger de requisições; dotenv para variáveis de ambiente; tsx para execução de TypeScript sem build manual.

**Front-end:** HTML5 e CSS3 (responsivo via `@media queries`) e JavaScript puro consumindo a API REST via `Fetch API`, sem frameworks.

**Inteligência artificial:** a tela de relatório (`/relatorio`) usa a **API gratuita do Google Gemini** para gerar a análise de pontos fortes e áreas de melhoria. Em vez de frases genéricas fixas por matéria, o sistema envia ao modelo a lista real de questões que o aluno acertou e errou (enunciado, nível e alternativa escolhida) e recebe de volta um texto curto, em linguagem natural, citando exatamente os temas trabalhados — por exemplo, identificando que o aluno tem facilidade com fração e soma, mas dificuldade em potenciação. A chave de API é injetada pelo servidor a partir da variável `GEMINI_API_KEY` no `.env`, nunca exposta no código-fonte versionado.

**Segurança:** as senhas dos usuários são armazenadas com hash **Argon2id**, usando a biblioteca [`argon2`](https://www.npmjs.com/package/argon2) (`argon2.hash`/`argon2.verify`). Nunca é salva a senha em texto puro — ao cadastrar, a senha é hasheada antes de ir ao banco; ao autenticar, a verificação é feita com `argon2.verify`, que já compara o hash de forma segura internamente.

O cadastro público sempre cria usuários como **alunos**; o campo `tipo` enviado pelo cliente não concede privilégios administrativos. Administradores são provisionados pelo seed ou por uma operação administrativa controlada. O backend também valida formato de e-mail, nome e data de nascimento antes de acessar o banco. O `JWT_SECRET` é obrigatório e deve ter pelo menos 32 caracteres; copie `.env.example` para `.env` e substitua o valor de exemplo por um segredo aleatório.

### Autenticação e proteção de rotas

O projeto passou a incluir um fluxo completo de autenticação por **JWT** para manter a sessão do usuário após o login. O cadastro continua funcionando em `POST /api/usuarios`, e o login foi adicionado em `POST /api/usuarios/login`. Quando o usuário faz login com e-mail e senha válidos, o backend gera um token com `jsonwebtoken` e o retorna no corpo da resposta. Esse token deve ser enviado no header `Authorization: Bearer <token>` em rotas privadas.

A proteção é realizada por um middleware (`src/middlewares/authMiddleware.ts`), que valida o token, identifica o usuário autenticado e injeta os dados no `req.user`. A rota `GET /api/usuarios/perfil` serve como exemplo de funcionalidade acessível apenas para usuários autenticados. Caso o cliente envie o token ausente, inválido ou expirado, a aplicação responde com `401 Unauthorized` e uma mensagem padronizada pela classe `HttpError`.

### Banco de dados empregado

**SQLite**, banco relacional leve armazenado em um único arquivo local (`backend/src/database/db.sqlite`), adequado para o escopo do projeto por não exigir servidor de banco separado.

### Estrutura de persistência

**Prisma ORM** é responsável por três frentes: (1) a **modelagem**, definida declarativamente em `schema.prisma`; (2) as **migrations**, versionadas em `prisma/migrations`, que criam e atualizam as tabelas no SQLite de forma reproduzível em qualquer ambiente; e (3) o **seed** (`src/database/seed.ts`), que popula o banco com dados iniciais de teste usando `INSERT OR IGNORE`, evitando duplicação ao rodar mais de uma vez.

### Forma como os dados são manipulados

O back-end segue o padrão **MVC** adaptado para API REST:

```
Requisição HTTP
      │
      ▼
┌─────────────┐
│   Routes    │  → define os endpoints (ex: GET /api/questoes)
└─────┬───────┘
      ▼
┌─────────────┐
│ Controllers │  → valida dados de entrada, aplica regras de negócio,
└─────┬───────┘     trata erros e define o status HTTP da resposta
      ▼
┌─────────────┐
│   Models    │  → centraliza o acesso ao banco usando o Prisma Client
└─────┬───────┘
      ▼
┌─────────────┐
│   SQLite    │  → banco de dados relacional
└─────────────┘
```

- **Routes** (`backend/src/routes`): mapeiam URLs para funções dos controllers (`questaoRoutes.ts`, `usuarioRoutes.ts`, `pageRoutes.ts`).
- **Controllers** (`backend/src/controllers`): recebem `Request`/`Response`, validam parâmetros e corpo da requisição, aplicam regras de negócio e retornam JSON com os códigos HTTP corretos (`200`, `201`, `400`, `404`, `409`).
- **Models** (`backend/src/models`): concentram todas as chamadas ao `prisma.questao.*` e `prisma.usuario.*` — nenhuma query aparece nos controllers.
- **Erros**: a classe `HttpError` (`backend/src/errors`) representa erros com status HTTP, capturados de forma centralizada pelo middleware `errorHandler`.
- **Middlewares**: `contentTypeJson` garante que requisições `POST`/`PUT`/`PATCH` enviem `Content-Type: application/json`.

---

## 📁 Estrutura de pastas

```
LuminaSaber/
├── public/                          # Front-end (estático)
│   ├── home.html
│   ├── cadastro.html
│   ├── cadastro_exercicios.html     # CRUD de questões (admin)
│   ├── seleção_disciplinas.html
│   ├── defina_seu_tempo.html
│   ├── meta_questoes.html
│   ├── relatorio.html               # Relatório com análise de IA (Gemini)
│   └── tela_exercicios/
│       ├── exercicios.html
│       ├── css/style.css
│       └── js/ (main.js, filtros.js, carregarQuestoes.js)
│
├── backend/                          # Aplicação Node.js/Express
│   ├── server.ts                     # Ponto de entrada do servidor
│   ├── prisma.config.ts              # Configuração do Prisma (schema, migrations, seed)
│   ├── .env.example                  # Modelo de variáveis de ambiente
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── request.http                  # Testes de API (REST Client)
│   ├── data/questoes.json            # Base de questões usada no seed
│   ├── prisma/
│   │   ├── schema.prisma             # Models, PKs, FKs e relacionamentos
│   │   └── migrations/               # Histórico de migrations do Prisma
│   └── src/
│       ├── routes/                   # Endpoints REST + injeção da chave do Gemini
│       ├── controllers/              # Validações, regras de negócio e respostas HTTP
│       ├── models/                   # Acesso ao banco via Prisma Client
│       ├── lib/
│       │   ├── prisma.ts             # Instância do Prisma Client (adapter SQLite)
│       │   └── crypto.ts             # Hash e verificação de senha (argon2)
│       ├── middlewares/              # contentTypeJson, errorHandler
│       ├── errors/HttpError.ts       # Classe de erro HTTP customizada
│       ├── database/
│       │   ├── database.ts           # Conexão com o SQLite
│       │   ├── migration.ts          # Script de criação das tabelas (SQL bruto)
│       │   └── seed.ts               # Carga inicial de dados
│       └── types/                    # Tipos TypeScript compartilhados
│
├── docs/
│   ├── erd.mmd                       # Diagrama ER (Mermaid)
│   ├── erd.png                       # Diagrama ER renderizado
│   ├── PI - Template Especificação Projeto.docx
│   └── Protótipo_telas_LuminaSaber.pdf
│
├── .gitignore
└── README.md
```

---

## ⚙️ Como executar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (recomendado: versão 22 ou superior)
- [Git](https://git-scm.com/)
- Uma chave gratuita da [API do Google Gemini](https://aistudio.google.com/) (para a análise de IA no relatório)
- Extensão **REST Client** no VSCode (opcional, para testar a API)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/walescaamaro/LuminaSaber.git
cd LuminaSaber

# 2. Acesse a pasta do backend (toda a aplicação fica aqui)
cd backend

# 3. Instale as dependências
npm install

# 4. Crie o arquivo de variáveis de ambiente
cp .env.example .env
# Edite o .env e adicione sua chave: GEMINI_API_KEY=sua_chave_aqui

# 5. Gere o Prisma Client
npm run prisma:generate

# 6. Crie/atualize as tabelas do banco de dados (Prisma Migrate)
# Se já existir uma migration em backend/prisma/migrations (caso do repositório clonado),
# este comando apenas aplica a migration existente ao seu banco local:
npx prisma migrate dev

# Caso esteja criando a migration inicial do zero (schema novo, sem pasta migrations/):
npx prisma migrate dev --name init

# 7. Popule o banco com dados iniciais
npm run seed

# 8. Inicie o servidor em modo desenvolvimento (reinicia automaticamente a cada alteração)
npm run dev
```

Acesse no navegador: **http://localhost:3000**

> 🔍 Para visualizar e editar os dados do banco em uma interface gráfica, use `npx prisma studio` (abre em `http://localhost:5555`).

> 🚀 Para rodar em modo produção (sem reinício automático), use `npm start` no lugar do passo 8.

---

## 🔌 Rotas da API

**Base URL:** `http://localhost:3000`

### Questões

| Método | Rota | Descrição | Status |
|--------|------|-----------|--------|
| `GET` | `/api/questoes` | Lista todas as questões | `200` |
| `GET` | `/api/questoes/:id` | Busca uma questão pelo ID | `200` / `404` |
| `POST` | `/api/questoes` | Cria uma nova questão | `201` / `400` / `409` |
| `PUT` | `/api/questoes/:id` | Atualiza uma questão existente | `200` / `400` / `404` |
| `DELETE` | `/api/questoes/:id` | Remove uma questão | `200` / `404` |

**Exemplo — criar questão:**

```json
POST /api/questoes
Content-Type: application/json

{
  "cod_disc": 82211,
  "enunciado": "Qual é a capital do Brasil?",
  "alternativa_A": "Rio de Janeiro",
  "alternativa_B": "Brasília",
  "alternativa_C": "Salvador",
  "alternativa_D": "Belo Horizonte",
  "alternativa_correta": "b",
  "dificuldade": "fácil"
}
```

### Usuários

| Método | Rota | Descrição | Status |
|--------|------|-----------|--------|
| `POST` | `/api/usuarios` | Cadastra um novo usuário | `201` / `400` / `409` |
| `GET` | `/api/usuarios` | Lista todos os usuários | `200` |

**Exemplo — cadastrar usuário:**

```json
POST /api/usuarios
Content-Type: application/json

{
  "nome": "Maria da Silva",
  "email": "maria@email.com",
  "senha": "senha123",
  "grau_escolar": "9º ano",
  "data_nasc": "2010-05-14",
  "tipo": "aluno"
}
```

---

## 🧪 Testando a API

### Via REST Client (VSCode) — recomendado

Abra o arquivo [`backend/request.http`](backend/request.http) e clique em **"Send Request"** acima de cada bloco. O arquivo já cobre consultas válidas, por ID inexistente e com ID inválido (`GET`); criação válida, com campos obrigatórios ausentes e com dados inválidos (`POST`); atualização válida, de registro inexistente e sem corpo (`PUT`); e remoção válida, de registro inexistente e com ID inválido (`DELETE`).

### Via cURL

```bash
# Listar todas as questões
curl http://localhost:3000/api/questoes

# Buscar questão por ID
curl http://localhost:3000/api/questoes/11154
```

---

## 📝 Dados iniciais (seed)

O comando `npm run seed` popula o banco com dados de exemplo para testes:

| Tabela | Quantidade | Exemplos |
|--------|-----------|----------|
| Usuários | 10 | 2 administradores e 8 alunos |
| Disciplinas | 7 | Matemática, Português, Ciências, Inglês, História, Geografia, Artes |
| Questões | 175 | Níveis fácil, médio e difícil, distribuídas entre as 7 disciplinas |
| Conteúdos | 12 | Tópicos como "Operações Básicas", "Interpretação de texto", etc. |
| Pastas | 5 | Pastas de anotações por tema |
| Anotações | 5 | Resumos de estudo |
| Histórico | 5 | Respostas registradas (acertou/errou) |

---

## 🔄 Roadmap

Funcionalidades previstas para próximas versões:

- [ ] Autenticação de usuários (login com perfis de aluno e administrador)
- [ ] CRUD completo de usuários pelo front-end (editar/remover)
- [ ] Módulo de anotações (criação de pastas, edição, exclusão e exportação em PDF)
- [ ] Módulo de histórico com opção de refazer questões anteriores
- [ ] Painel administrativo para gerenciamento de usuários

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais. Teve início como atividade da disciplina de **Projeto Integrador**, já concluída, e atualmente segue em desenvolvimento como atividade da disciplina de **Linguagem e Técnicas de Programação II**, ambas do **Instituto Federal de Educação, Ciência e Tecnologia da Paraíba (IFPB)**.
