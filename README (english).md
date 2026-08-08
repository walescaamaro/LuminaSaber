<div align="center">

# 🌟 LuminaSaber

### Free, gamified web platform for learning support in basic education

</div>

---

## 📖 1. System Overview

**System objective:** LuminaSaber is a web platform designed to **support the studies of basic education students** (from kindergarten through 9th grade), enabling user registration, multiple-choice question practice, study goal setting, and the generation of performance reports with personalized AI-driven analysis.

**Target audience:** basic education students looking to practice subject content for free in a gamified way, and administrators responsible for creating and maintaining the question bank.

**Key features:**
- User registration (student or administrator);
- Subject, study time, and question-goal selection;
- Solving multiple-choice exercises with search and filter by subject;
- Performance report with AI-generated strengths and areas for improvement, citing exactly the topics the student got right and wrong;
- Full CRUD for questions through the admin panel.

The project was originally developed for the **Integrative Project** course, which has since concluded, and is currently being continued as coursework for **Programming Languages and Techniques II** at the **Federal Institute of Education, Science and Technology of Paraíba (IFPB)**, focusing on the integration of **front-end**, **back-end (Node.js/Express + TypeScript)**, and a **relational database (SQLite)** via **Prisma ORM**.

### 👩‍💻 Team

| Name | Student ID |
|------|-----------|
| Walesca Amaro Rodrigues | 20241780019 |
| Rayssa Priscila Silva Nascimento | 20241780013 |

---

## ✨ Features and Screens

| Screen | Route | Description | Access |
|------|------|-----------|--------|
| 🏠 Home | `/` | Platform introduction | Public |
| 📝 User Registration | `/cadastro` | Registration form (student or administrator) | Public |
| 📚 Subject Selection | `/selecao` | Choosing which subject to study | User |
| ⏱️ Time Setting | `/tempo` | Setting the study time | User |
| 🎯 Question Goal | `/meta` | Setting the goal for number of questions to answer | User |
| ✏️ Exercises | `/exercicios` | Answering questions, with filters and search | User |
| 📊 Report | `/relatorio` | Performance, strengths/weaknesses, and AI analysis | User |
| ⚙️ Exercise Registration | `/cadastro-exercicios` | Full CRUD for questions | Administrator |

---

## 🖥️ 2. Interface Demonstration (CRUD)

The **Exercise Registration** screen (`/cadastro-exercicios`) is the project's main demonstration of CRUD integration, covering all four operations on the `questao` table:

| Operation | How It's Done in the Interface | API Route |
|----------|---------------------------|-------------|
| **Create** | Form registers a new question | `POST /api/questoes` |
| **Read** | Table lists all registered questions | `GET /api/questoes` |
| **Update** | The "Editar" (Edit) button loads the data into the form and saves the changes | `PUT /api/questoes/:id` |
| **Delete** | The "Excluir" (Delete) button removes the question, with a prior confirmation | `DELETE /api/questoes/:id` |

**How communication between the interface and the database works:** the front-end (plain HTML/JS, no framework) uses the browser's `Fetch API` to send HTTP requests to the Express REST API. The `Controller` validates the incoming data and delegates to the `Model`, which performs the database operation through **Prisma Client**. The response (JSON) goes back to the front-end, which updates the table on screen **without needing to reload the page**.

```
Front-end (fetch)  →  Routes  →  Controllers (validation)  →  Models (Prisma)  →  SQLite
                                         ↓
                                  JSON response (200/201/400/404/409)
```

The **Exercises** screen (`/exercicios`) also demonstrates `Read` from the student's side: questions are fetched via `GET /api/questoes`, filtered by subject in the browser itself, and each of the student's answers is shown immediately (✅ correct / ❌ incorrect, along with the correct option).

---

## 💾 3. Data Persistence

Data is stored in a physical SQLite database file (`backend/src/database/db.sqlite`), **not in memory** — so it stays saved even after restarting the server or the computer.

**How to confirm persistence in practice:**

1. Register a question via the `/cadastro-exercicios` screen (or a user via the `/cadastro` screen);
2. Stop the server (`Ctrl+C` in the terminal);
3. Start the server again (`npm run dev`);
4. Go to `/cadastro-exercicios` (or the corresponding listing) — the registered record is still there.

**Viewing the table directly in the database**, without going through the interface:

```bash
npx prisma studio
```

This command opens a visual interface in the browser (`http://localhost:5555`) showing all the database tables. Just click `Questao` or `Usuario` to see the saved records, even with the main server turned off — proof that the data was truly persisted in SQLite and not just held in the application's memory.

---

## 🧪 4. Integrity Tests

The tests below, found in [`backend/request.http`](backend/request.http) (VSCode's **REST Client** extension), demonstrate that the system rejects inconsistent data before any write to the database:

| Test | Scenario | Expected Result |
|-------|---------|---------------------|
| Empty required fields | `POST /api/questoes` without `enunciado` or without the answer options | `400 Bad Request` — lists the missing fields |
| Invalid data | `alternativa_correta` outside `a`, `b`, `c`, `d` | `400 Bad Request` |
| Malformed ID | `GET/PUT/DELETE /api/questoes/abc` (non-numeric) | `400 Bad Request` |
| Nonexistent record | `GET/PUT/DELETE` with an ID that doesn't exist in the database | `404 Not Found` |
| Duplicate registration | Repeating a question that's already registered | `409 Conflict` |
| Partial update | `PUT` with no fields in the request body | `400 Bad Request` — "send at least one field" |
| Valid update | `PUT` with one or more valid fields | `200 OK` — question updated |
| Valid deletion | `DELETE` of an existing ID | `200 OK` — confirms removal |

**How the system prevents inconsistencies:** all validation happens at the **Controller** layer, before any call to the database — no query is ever run with invalid data. IDs are converted and checked with `Number.isNaN`; required fields are checked against a fixed list (`CAMPOS_OBRIGATORIOS`); the correct-answer letter is normalized and validated against a closed set (`a/b/c/d`); and duplicates are treated as a business error (`409`), not a generic failure. Errors never fail silently — they all pass through a central `HttpError` class, caught by an `errorHandler` middleware that standardizes the JSON error response.

---

## 🗄️ 5. Database Structure

The data model lives in [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma), with **12 models** representing the system's entities, including primary keys, foreign keys, and 1:N and N:N relationships.

<div align="center">
  <img src="docs/erd.png" alt="LuminaSaber ERD Diagram" width="100%" />
</div>

> Editable version of the diagram (Mermaid): [`docs/erd.mmd`](docs/erd.mmd)

### Main Entities

| Model | Description | Primary Key |
|-------|-----------|-----------------|
| `Usuario` | Students and administrators | `cod_usuario` |
| `Disciplina` | Subjects (Math, Portuguese, etc.) | `cod_disc` |
| `Questao` | Multiple-choice questions (4 options) | `cod_quest` |
| `Conteudo` | Topics/content for each subject | `cod_conteudo` |
| `Pasta` | User's note folders | `cod_pasta` |
| `Anotacao` | Notes created by the user | `cod_anota` |
| `Historico` | Answer log (correct/incorrect) | `cod_resposta` |
| `Relatorio` | Performance report | `cod_relatorio` |
| `Suporte` | Support/feedback requests | `cod_suporte` |
| `Estuda` | N:N join between `Usuario` and `Disciplina` (goals) | `cod_usuario` + `cod_disc` |
| `Contem` | N:N join between `Pasta` and `Anotacao` | `cod_pasta` + `cod_anota` |
| `Possui` | N:N join between `Questao` and `Historico` | `cod_quest` + `cod_resposta` |

### Relationship Examples

- **1:N** — A `Disciplina` has many `Questao` (`Questao.cod_disc → Disciplina.cod_disc`).
- **1:N** — A `Usuario` can create many `Pasta` and `Anotacao`.
- **N:N** — A `Usuario` "studies" many `Disciplina` (and vice versa), modeled by the `Estuda` table, which also stores the goal and the study time.
- **N:N** — A `Pasta` can contain many `Anotacao` (and a note can belong to more than one folder), via `Contem`.

---

## 🧰 6. Technical Documentation

### Technology Used

**Back-end:** Node.js + Express.js for the HTTP server and routing; TypeScript in `strict` mode for static typing; Morgan as the request logger; dotenv for environment variables; tsx for running TypeScript without a manual build step.

**Front-end:** HTML5 and CSS3 (responsive via `@media queries`) and vanilla JavaScript consuming the REST API through the `Fetch API`, with no frameworks.

**Artificial intelligence:** the report screen (`/relatorio`) uses the **free Google Gemini API** to generate the strengths and areas-for-improvement analysis. Instead of fixed, generic phrases per subject, the system sends the model the student's actual list of correct and incorrect answers (question text, difficulty level, and the option chosen) and gets back a short, natural-language text that cites exactly the topics covered — for example, identifying that the student is comfortable with fractions and addition but struggles with exponentiation. The API key is injected by the server from the `GEMINI_API_KEY` variable in `.env`, and is never exposed in the versioned source code.

**Security:** user passwords are stored hashed with **Argon2id**, using the [`argon2`](https://www.npmjs.com/package/argon2) library (`argon2.hash`/`argon2.verify`). Passwords are never saved in plain text — on sign-up, the password is hashed before it's written to the database; on login, verification is done with `argon2.verify`, which securely compares the hash internally.

### Database Used

**SQLite**, a lightweight relational database stored in a single local file (`backend/src/database/db.sqlite`), well suited to the project's scope since it doesn't require a separate database server.

### Persistence Structure

**Prisma ORM** handles three areas: (1) **modeling**, declared in `schema.prisma`; (2) **migrations**, versioned under `prisma/migrations`, which create and update the SQLite tables reproducibly in any environment; and (3) the **seed** (`src/database/seed.ts`), which populates the database with initial test data using `INSERT OR IGNORE`, avoiding duplicates when run more than once.

### How the Data Is Handled

The back-end follows the **MVC** pattern adapted for a REST API:

```
HTTP Request
      │
      ▼
┌─────────────┐
│   Routes    │  → defines the endpoints (e.g. GET /api/questoes)
└─────┬───────┘
      ▼
┌─────────────┐
│ Controllers │  → validates input data, applies business rules,
└─────┬───────┘     handles errors, and sets the HTTP response status
      ▼
┌─────────────┐
│   Models    │  → centralizes database access using Prisma Client
└─────┬───────┘
      ▼
┌─────────────┐
│   SQLite    │  → relational database
└─────────────┘
```

- **Routes** (`backend/src/routes`): map URLs to controller functions (`questaoRoutes.ts`, `usuarioRoutes.ts`, `pageRoutes.ts`).
- **Controllers** (`backend/src/controllers`): receive `Request`/`Response`, validate request parameters and body, apply business rules, and return JSON with the correct HTTP status codes (`200`, `201`, `400`, `404`, `409`).
- **Models** (`backend/src/models`): centralize all calls to `prisma.questao.*` and `prisma.usuario.*` — no query ever appears in the controllers.
- **Errors**: the `HttpError` class (`backend/src/errors`) represents errors with an HTTP status, caught centrally by the `errorHandler` middleware.
- **Middlewares**: `contentTypeJson` ensures that `POST`/`PUT`/`PATCH` requests send `Content-Type: application/json`.

---

## 📁 Folder Structure

```
LuminaSaber/
├── public/                          # Front-end (static)
│   ├── home.html
│   ├── cadastro.html
│   ├── cadastro_exercicios.html     # Question CRUD (admin)
│   ├── seleção_disciplinas.html
│   ├── defina_seu_tempo.html
│   ├── meta_questoes.html
│   ├── relatorio.html               # Report with AI analysis (Gemini)
│   └── tela_exercicios/
│       ├── exercicios.html
│       ├── css/style.css
│       └── js/ (main.js, filtros.js, carregarQuestoes.js)
│
├── backend/                          # Node.js/Express application
│   ├── server.ts                     # Server entry point
│   ├── prisma.config.ts              # Prisma configuration (schema, migrations, seed)
│   ├── .env.example                  # Environment variable template
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── request.http                  # API tests (REST Client)
│   ├── data/questoes.json            # Question bank used by the seed
│   ├── prisma/
│   │   ├── schema.prisma             # Models, PKs, FKs, and relationships
│   │   └── migrations/               # Prisma migration history
│   └── src/
│       ├── routes/                   # REST endpoints + Gemini key injection
│       ├── controllers/              # Validation, business rules, and HTTP responses
│       ├── models/                   # Database access via Prisma Client
│       ├── lib/
│       │   ├── prisma.ts             # Prisma Client instance (SQLite adapter)
│       │   └── crypto.ts             # Password hashing and verification (argon2)
│       ├── middlewares/              # contentTypeJson, errorHandler
│       ├── errors/HttpError.ts       # Custom HTTP error class
│       ├── database/
│       │   ├── database.ts           # SQLite connection
│       │   ├── migration.ts          # Table-creation script (raw SQL)
│       │   └── seed.ts               # Initial data load
│       └── types/                    # Shared TypeScript types
│
├── docs/
│   ├── erd.mmd                       # ER diagram (Mermaid)
│   ├── erd.png                       # Rendered ER diagram
│   ├── PI - Template Especificação Projeto.docx
│   └── Protótipo_telas_LuminaSaber.pdf
│
├── .gitignore
└── README.md
```

---

## ⚙️ How to Run the Project

### Prerequisites

- [Node.js](https://nodejs.org/) (recommended: version 22 or higher)
- [Git](https://git-scm.com/)
- A free key from the [Google Gemini API](https://aistudio.google.com/) (for the AI analysis in the report)
- VSCode's **REST Client** extension (optional, for testing the API)

### Step by Step

```bash
# 1. Clone the repository
git clone https://github.com/walescaamaro/LuminaSaber.git
cd LuminaSaber

# 2. Go into the backend folder (the whole application lives here)
cd backend

# 3. Install the dependencies
npm install

# 4. Create the environment variables file
cp .env.example .env
# Edit .env and add your key: GEMINI_API_KEY=your_key_here

# 5. Generate the Prisma Client
npm run prisma:generate

# 6. Create/update the database tables (Prisma Migrate)
# If a migration already exists in backend/prisma/migrations (as with a cloned repo),
# this command just applies the existing migration to your local database:
npx prisma migrate dev

# If you're creating the initial migration from scratch (new schema, no migrations/ folder yet):
npx prisma migrate dev --name init

# 7. Seed the database with initial data
npm run seed

# 8. Start the server in development mode (restarts automatically on every change)
npm run dev
```

Open in your browser: **http://localhost:3000**

> 🔍 To view and edit the database data in a graphical interface, use `npx prisma studio` (opens at `http://localhost:5555`).

> 🚀 To run in production mode (without automatic restarts), use `npm start` instead of step 8.

---

## 🔌 API Routes

**Base URL:** `http://localhost:3000`

### Questions

| Method | Route | Description | Status |
|--------|------|-----------|--------|
| `GET` | `/api/questoes` | Lists all questions | `200` |
| `GET` | `/api/questoes/:id` | Finds a question by ID | `200` / `404` |
| `POST` | `/api/questoes` | Creates a new question | `201` / `400` / `409` |
| `PUT` | `/api/questoes/:id` | Updates an existing question | `200` / `400` / `404` |
| `DELETE` | `/api/questoes/:id` | Deletes a question | `200` / `404` |

**Example — create a question:**

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

### Users

| Method | Route | Description | Status |
|--------|------|-----------|--------|
| `POST` | `/api/usuarios` | Registers a new user | `201` / `400` / `409` |
| `GET` | `/api/usuarios` | Lists all users | `200` |

**Example — register a user:**

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

## 🧪 Testing the API

### Via REST Client (VSCode) — Recommended

Open [`backend/request.http`](backend/request.http) and click **"Send Request"** above each block. The file already covers valid lookups, lookups by a nonexistent ID, and lookups with an invalid ID (`GET`); valid creation, creation with missing required fields, and creation with invalid data (`POST`); valid updates, updates on a nonexistent record, and updates with an empty body (`PUT`); and valid deletion, deletion of a nonexistent record, and deletion with an invalid ID (`DELETE`).

### Via cURL

```bash
# List all questions
curl http://localhost:3000/api/questoes

# Find a question by ID
curl http://localhost:3000/api/questoes/11154
```

---

## 📝 Initial Data (Seed)

The `npm run seed` command populates the database with sample data for testing:

| Table | Quantity | Examples |
|--------|-----------|----------|
| Users | 10 | 2 administrators and 8 students |
| Subjects | 7 | Math, Portuguese, Science, English, History, Geography, Arts |
| Questions | 175 | Easy, medium, and hard levels, spread across the 7 subjects |
| Content | 12 | Topics such as "Basic Operations," "Text Interpretation," etc. |
| Folders | 5 | Note folders by topic |
| Notes | 5 | Study summaries |
| History | 5 | Logged answers (correct/incorrect) |

---

## 🔄 Roadmap

Features planned for upcoming versions:

- [ ] User authentication (login with student and administrator profiles)
- [ ] Full user CRUD from the front-end (edit/remove)
- [ ] Notes module (folder creation, editing, deletion, and PDF export)
- [ ] History module with the option to redo previous questions
- [ ] Admin panel for user management

---

## 📄 License

This project was developed for educational purposes. It began as coursework for **Integrative Project**, which has since concluded, and is currently being continued as coursework for **Programming Languages and Techniques II**, both at the **Federal Institute of Education, Science and Technology of Paraíba (IFPB)**.
