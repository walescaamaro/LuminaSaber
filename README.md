<div align="center">

# 🌟 LuminaSaber

**Plataforma web gamificada e gratuita de apoio ao aprendizado da educação básica**

</div>

---

## 📖 Sobre o Projeto

O **LuminaSaber** é uma plataforma web voltada para estudantes da educação básica (jardim de infância ao 9º ano), oferecendo exercícios de múltipla escolha adaptados ao ritmo de cada aluno, de forma **gratuita, inclusiva e organizada**.

A proposta é incentivar a autonomia nos estudos, com recursos como:
- 📝 Exercícios de múltipla escolha por disciplina
- 📊 Relatórios de desempenho
- 🗒️ Canto de anotações digitais
- 🔍 Barra de pesquisa de conteúdos
- 📁 Organização de anotações em pastas

### ✨ Diferenciais

- **Arquitetura MVC**: Separação clara entre Models, Controllers e Routes
- **Prisma ORM**: Type-safe database operations com SQLite
- **RESTful API**: Backend com Express.js e Node.js
- **Database com Constraints**: Validações a nível de banco de dados
- **Seed de Dados**: 35 questões prontas em 7 disciplinas
- **Relatórios**: Análise de desempenho do aluno

---

## 👩‍💻 Equipe

| Nome | Matrícula |
|------|-----------|
| Walesca Amaro Rodrigues | 20241780019 |
| Rayssa Priscila Silva Nascimento | 20241780013 |

---

## 🗂️ Módulos da Aplicação

| Módulo | Descrição | Acesso |
|--------|-----------|--------|
| 🏠 **Cadastro** | Apresentação do site, cadastro de usuário e login | Público |
| 📚 **Início** | Seleção de disciplinas e definição do tempo/meta de estudo | Usuário logado |
| ✏️ **Exercício** | Questões de múltipla escolha, barra de pesquisa, relatório e anotações | Usuário logado |
| 🗒️ **Anotações** | Gerenciamento e organização de anotações por pastas | Usuário logado |
| 📅 **Histórico** | Visualização e revisão de questões respondidas anteriormente | Usuário logado |
| ⚙️ **Configuração** | Gerenciamento geral da plataforma | Administrador |
| 📋 **Cadastro de Exercícios** | Inserção, edição e remoção de questões | Administrador |

---

## 🚀 Tecnologias Utilizadas

- **Back-end:** Node.js + Express + Morgan + Prisma Client
- **Front-end:** HTML, CSS, JavaScript (ES Modules)
- **Testes de API:** REST Client (VSCode)
- **Banco de Dados:** SQLite modelado com Prisma (`prisma/schema.prisma`)
- **Versionamento:** Git

---

## 📁 Estrutura do Projeto

```
LuminaSaber/
├── public/                          # Arquivos front-end
│   ├── home.html                    # Tela inicial
│   ├── cadastro.html                # Página de cadastro de usuário
│   ├── cadastro_exercicios.html     # Cadastro de exercícios (admin)
│   ├── seleção_disciplinas.html     # Seleção de disciplinas
│   ├── tela_exercicios/             # Módulo de exercícios
│   │   ├── exercicios.html
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       ├── main.js
│   │       ├── carregarQuestoes.js
│   │       └── filtros.js
│   └── (imagens: logo.png, onda.png, etc.)
├── backend/                         # Servidor Node.js
│   ├── server.ts                    # Entrada da aplicação
│   ├── package.json
│   ├── data/
│   │   └── questoes.json            # Dados de seed das questões
│   └── src/
│       ├── controllers/
│       │   ├── questaoController.js
│       │   └── usuarioController.js
│       ├── database/
│       │   ├── database.js          # Conexão com SQLite
│       │   ├── migration.js         # Criação das tabelas
│       │   └── seed.js              # Carga inicial de dados
│       ├── models/
│       │   ├── questaoModel.ts      # CRUD de questões com Prisma Client
│       │   └── usuarioModel.ts      # Operações de usuários com Prisma Client
│       ├── lib/
│       │   └── prisma.ts            # Configuração do Prisma Client
│       └── routes/
│           ├── questaoRoutes.js
│           ├── usuarioRoutes.js
│           └── pageRoutes.js
├── docs/
│   ├── erd.mmd                      # Diagrama ER (Mermaid)
│   ├── erd.png
│   ├── backend-prisma-mvc.md        # Explicação Prisma, ERD, MVC e CRUD
│   └── diagrama_logico.png
├── prisma/
│   └── schema.prisma                # Models, PKs, FKs e relacionamentos
└── README.md
```

---

## ⚙️ Como Rodar o Projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado — **versão 22 ou superior** (obrigatório para o módulo nativo `node:sqlite`)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/walescaamaro/LuminaSaber.git

# 2. Entre na pasta do backend
cd backend

# 3. Instale as dependências
npm install

# 4. Gere o Prisma Client
npm run prisma:generate

# 5. Crie as tabelas no banco de dados
npm run migrate

# 6. Popule o banco com dados iniciais
npm run seed

# 7. Inicie o servidor
npm start
```

Acesse no navegador: **http://localhost:3000**

---

## 🗄️ Prisma, ERD e MVC

A modelagem do banco está em `prisma/schema.prisma`, com models como `Usuario`, `Disciplina`, `Questao`, `Historico`, `Pasta`, `Anotacao` e tabelas associativas. O diagrama ERD obrigatório está em `docs/erd.png`, com a versão editável em `docs/erd.mmd`.

O backend segue MVC: as rotas ficam em `backend/src/routes`, os Controllers validam requisições e respostas em `backend/src/controllers`, e os Models em `backend/src/models` centralizam o acesso ao SQLite usando Prisma Client. A explicação completa dos models, chaves primárias, chaves estrangeiras, relacionamentos e CRUD está em `docs/backend-prisma-mvc.md`.

## 🗄️ Estado da Integração com o Banco de Dados

> O banco de dados SQLite está **integrado ao front-end** nas seguintes funcionalidades:

| Funcionalidade | Interface | Banco de Dados | Status |
|----------------|-----------|----------------|--------|
| Cadastro de usuário | `cadastro.html` | Tabela `USUARIO` | ✅ Integrado |
| Cadastro de questões | `cadastro_exercicios.html` | Tabela `questao` | ✅ Integrado |
| Listagem de questões | `tela_exercicios/exercicios.html` | Tabela `questao` | ✅ Integrado |
| Login / autenticação | — | — | 🔄 Previsto |
| Histórico de respostas | — | — | 🔄 Previsto |
| Anotações | — | — | 🔄 Previsto |

As demais telas ainda operam de forma independente do banco e serão integradas nas próximas fases do projeto.

---

## 🔌 Rotas da API (padrão REST)

Base URL: `http://localhost:3000`

### Questões

| Método | Rota | Descrição | Status de Retorno |
|--------|------|-----------|-----------|
| `GET` | `/api/questoes` | Lista todas as questões | 200 |
| `GET` | `/api/questoes/:id` | Busca questão por ID | 200 / 404 |
| `POST` | `/api/questoes` | Cria nova questão | 201 / 400 |
| `PUT` | `/api/questoes/:id` | Atualiza questão existente | 200 / 404 |
| `DELETE` | `/api/questoes/:id` | Remove uma questão | 200 / 404 |

### Usuários

| Método | Rota | Descrição | Status de Retorno |
|--------|------|-----------|-----------|
| `POST` | `/api/usuarios` | Cadastra novo usuário | 201 / 400 / 409 |
| `GET` | `/api/usuarios` | Lista todos os usuários | 200 |

### Exemplo de cadastro de usuário

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

### Exemplo de cadastro de questão

```json
POST /api/questoes
Content-Type: application/json

{
  "nivel": "Fácil",
  "materia": "Matemática",
  "enunciado": "Quanto é 2 + 2?",
  "alternativas": ["1", "2", "3", "4"],
  "correta": 3
}
```

---

## 🔍 Verificando os Dados no Banco

Com o servidor parado (ou em outro terminal), é possível consultar o SQLite diretamente via Node.js para confirmar que os dados estão sendo persistidos corretamente.

### Verificar questões cadastradas

```bash
node -e "import('./src/database/database.js').then(async m => { const c = await m.default.connect(); console.log(await c.all('SELECT * FROM questao')); await c.close(); })"
```

### Verificar usuários cadastrados

```bash
node -e "import('./src/database/database.js').then(async m => { const c = await m.default.connect(); console.log(await c.all('SELECT * FROM USUARIO')); await c.close(); })"
```

> ⚠️ Execute esses comandos **dentro da pasta `backend/`**, pois o caminho do banco de dados é relativo ao diretório de trabalho.

---

## ✅ Fluxo de Integração: Interface → Banco

O fluxo completo para as funcionalidades integradas segue o seguinte caminho:

```
Usuário preenche o formulário (HTML)
        ↓
Validação no front-end (campos obrigatórios, formato de e-mail, etc.)
        ↓
Requisição HTTP enviada ao back-end (fetch/API REST)
        ↓
Validação no back-end (Controller verifica dados, duplicatas, tipos)
        ↓
Gravação no banco SQLite (via Prisma Client nos Models)
        ↓
Resposta JSON retornada ao front-end (sucesso ou mensagem de erro)
        ↓
Interface atualizada com feedback ao usuário
```

### Validações implementadas

- Campos obrigatórios verificados antes de qualquer operação de escrita
- Formato de e-mail validado por expressão regular
- E-mail duplicado detectado com consulta prévia ao banco (`SELECT` antes do `INSERT`)
- Tipo de usuário restrito a `"aluno"` ou `"administrador"` (via `CHECK` no banco)
- Grau escolar obrigatório apenas para usuários do tipo `"aluno"`
- Erros de banco retornam mensagens claras para o front-end (HTTP 400, 404, 409 ou 500)

---

## 🗄️ Banco de Dados

O banco de dados é **SQLite**, gerenciado pelo módulo nativo `node:sqlite` disponível a partir do **Node.js v22**. O arquivo gerado é `backend/src/database/db.sqlite`.

A estrutura é criada automaticamente pelo script de migration (`npm run migrate`) e populada pelo seed (`npm run seed`).

### Tabelas do modelo relacional

`USUARIO` · `disciplina` · `suporte` · `questao` · `historico` · `pasta` · `anotacao` · `relatorio` · `estuda` · `possui` · `contem`

Os diagramas estão disponíveis na pasta `docs/`:

| Arquivo | Descrição |
|---------|-----------|
| `erd.mmd` | Diagrama ER em Mermaid (texto) |
| `erd.png` | Diagrama ER renderizado |
| `diagrama_logico.png` | Diagrama lógico do banco |

---

## 📚 Disciplinas Disponíveis

- 📐 Matemática
- 📖 Português
- 🔬 Ciências
- 🌍 Geografia
- 🏛️ História
- 🎨 Artes
- 🇺🇸 Inglês

---

### Previstas para próximas versões 🔄

- Autenticação de usuários (login com verificação de perfil: aluno e administrador)
- Temporizador de estudo e definição de meta de questões
- Relatório de desempenho ao fim de cada sessão
- Módulo de anotações com criação de pastas, edição, exclusão e exportação em PDF
- Módulo de histórico com opção de refazer questões anteriores
- Painel do administrador (configurações gerais e gerenciamento de usuários)
- Sistema adaptativo que prioriza conteúdos com maior dificuldade para o aluno

---

## � Documentação Técnica Completa

### 1. **Modelagem de Banco de Dados com Prisma e ERD** (20 pontos)

📄 **Arquivo:** [`docs/modelagem-banco-dados-prisma-erd.md`](docs/modelagem-banco-dados-prisma-erd.md)

Documentação completa sobre a modelagem do banco de dados, incluindo:

- ✅ **Schema Prisma** com todos os models (`Usuario`, `Disciplina`, `Questao`, etc.)
- ✅ **12 Entidades** com atributos definidos, tipos de dados e constraints
- ✅ **Chaves Primárias (PK)** e **Chaves Estrangeiras (FK)** identificadas
- ✅ **Relacionamentos** um-para-muitos (1:N) e muitos-para-muitos (N:N)
  - Exemplo: Um usuário pode ter múltiplas anotações
  - Exemplo: Uma questão pode estar em múltiplos conteúdos
- ✅ **Diagrama ERD (Entity Relationship Diagram)** em Mermaid
- ✅ **Operações de inicialização**: migration e seed

**Modelos principais:**
- `USUARIO` (alunos e administradores)
- `DISCIPLINA` (Matemática, Português, etc.)
- `QUESTAO` (exercícios com 4 alternativas)
- `HISTORICO` (rastreamento de respostas)
- `PASTA` e `ANOTACAO` (organização de anotações)
- `ESTUDA` (metas por disciplina)
- Tabelas associativas: `CONTEM`, `POSSUI`

---

### 2. **Arquitetura MVC, Integração com BD e Operações CRUD** (25 pontos)

📄 **Arquivo:** [`docs/arquitetura-mvc-e-crud.md`](docs/arquitetura-mvc-e-crud.md)

Documentação completa sobre a implementação da arquitetura MVC integrada ao back-end, incluindo:

- ✅ **Separação de Responsabilidades** entre Models, Controllers e Routes
- ✅ **Camada de Models** (`backend/src/models/`)
  - Centraliza **todas as operações de banco de dados**
  - Usa **Prisma Client** para consultas type-safe
  - Retorna dados estruturados para Controllers
  - Exemplo: `QuestaoModel.listarTodas()`, `QuestaoModel.criar()`, etc.

- ✅ **Camada de Controllers** (`backend/src/controllers/`)
  - Recebe requisições HTTP via Express.js
  - **Valida parâmetros** e dados de entrada
  - Implementa **regras de negócio** da aplicação
  - Chama o Model para operações de BD
  - **Mapeia respostas** para o formato esperado pelo frontend (DTO Pattern)
  - Trata erros e retorna HTTP status codes apropriados (201, 400, 404, 409, 500)

- ✅ **Camada de Routes** (`backend/src/routes/`)
  - Define endpoints REST
  - Mapeia URLs a handlers do Controller
  - Exemplo: `GET /api/questoes`, `POST /api/questoes/:id`, etc.

- ✅ **Operações CRUD** completas:
  - **CREATE** (POST): Inserir nova questão com validações
  - **READ** (GET): Listar todas ou buscar por ID
  - **UPDATE** (PUT): Atualizar campos existentes
  - **DELETE** (DELETE): Remover questões com verificação de existência

- ✅ **Fluxo completo de requisição** do frontend até o banco de dados
- ✅ **Tratamento de erros** centralizado em middleware
- ✅ **Exemplos práticos** de cada operação CRUD

**Tecnologias integradas:**
- Express.js (HTTP server)
- Prisma Client (database ORM)
- SQLite (banco relacional)
- TypeScript (tipagem estática)
- Node.js (runtime)

---

## 📝 Dados de Exemplo (Seed)

O banco é inicializado com dados reais para testes:

| Tabela | Quantidade | Exemplos |
|--------|-----------|----------|
| **Usuários** | 10 | 2 admin (Walesca, Rayssa), 8 alunos |
| **Disciplinas** | 7 | Matemática, Português, Ciências, Inglês, História, Geografia, Artes |
| **Questões** | 35 | 5-6 questões por disciplina, níveis: fácil, médio, difícil |
| **Conteúdos** | 12 | Tópicos como "Operações Básicas", "Interpretação de texto", etc. |
| **Pastas** | 5 | Anotações organizadas por tema |
| **Anotações** | 5 | Resumos de estudo com datas |
| **Histórico** | 5 | Respostas de usuários com status (Acertou/Errou) |

### Como carregar dados iniciais

```bash
cd backend
npm run seed
```

---

## 🧪 Testando a API

### Via cURL (linha de comando)

```bash
# Listar todas as questões
curl http://localhost:3000/api/questoes

# Buscar questão por ID
curl http://localhost:3000/api/questoes/11154

# Criar nova questão (POST)
curl -X POST http://localhost:3000/api/questoes \
  -H "Content-Type: application/json" \
  -d '{
    "cod_disc": 82211,
    "enunciado": "Qual é a capital do Brasil?",
    "alternativa_A": "Rio de Janeiro",
    "alternativa_B": "Brasília",
    "alternativa_C": "Salvador",
    "alternativa_D": "Belo Horizonte",
    "alternativa_correta": "b",
    "dificuldade": "fácil"
  }'
```

### Via REST Client do VSCode

Use o arquivo `backend/request.http` para testar endpoints com interface gráfica.

### Via Postman ou Insomnia

Importe o `backend/request.http` em seu cliente HTTP favorito.

---

## 🔧 Troubleshooting

### Erro: "The module was compiled against a different Node.js version"

**Solução:** Reconstruir módulos nativos

```bash
cd backend
npm rebuild
```

### Erro: "Arquivo db.sqlite não encontrado"

**Solução:** Executar migration para criar o banco

```bash
npm run migrate
```

### Erro: "Questões não aparecem na tela"

**Solução:** 
1. Verificar se servidor está rodando em http://localhost:3000
2. Rodar `npm run seed` para popular o banco
3. Abrir DevTools (F12) e verificar console para erros de rede

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais no **Instituto Federal de Educação, Ciência e Tecnologia da Paraíba (IFPB)**.
