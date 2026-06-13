# 🏗️ Arquitetura MVC com Prisma Client e Operações CRUD

## 📋 Sumário
- [Visão Geral da Arquitetura MVC](#visão-geral-da-arquitetura-mvc)
- [Separação de Responsabilidades](#separação-de-responsabilidades)
- [Models - Camada de Dados](#models---camada-de-dados)
- [Controllers - Camada de Lógica](#controllers---camada-de-lógica)
- [Routes - Camada de Roteamento](#routes---camada-de-roteamento)
- [Operações CRUD](#operações-crud)
- [Fluxo de Requisição](#fluxo-de-requisição)
- [Exemplos de Implementação](#exemplos-de-implementação)

---

## 🎯 Visão Geral da Arquitetura MVC

A arquitetura **MVC (Model-View-Controller)** no LuminaSaber foi implementada com:

- **Backend**: Node.js + Express.js + Prisma Client + SQLite
- **Frontend**: HTML, CSS, JavaScript ES Modules
- **Banco de Dados**: SQLite com Prisma ORM

```
┌─────────────────┐
│   Frontend      │ (HTML/CSS/JS)
│   (Browser)     │
└────────┬────────┘
         │ HTTP Requests
         │ (GET, POST, PUT, DELETE)
         ▼
┌─────────────────────────────────────┐
│     Express.js + Node.js Backend    │
├─────────────────────────────────────┤
│ Routes (Roteamento de requisições)  │ <- questaoRoutes.ts, usuarioRoutes.ts
├─────────────────────────────────────┤
│ Controllers (Lógica da aplicação)   │ <- questaoController.ts
├─────────────────────────────────────┤
│ Models (Acesso aos dados)           │ <- questaoModel.ts com Prisma Client
└─────────────────────────────────────┘
         │
         │ Queries SQL (Prisma)
         ▼
┌─────────────────────────────────────┐
│      Prisma Client ORM              │
│  (Abstração do banco de dados)      │
└─────────────────────────────────────┘
         │
         │ SQL Nativo
         ▼
┌─────────────────────────────────────┐
│    SQLite Database                  │
│  (db.sqlite)                        │
└─────────────────────────────────────┘
```

---

## 🔄 Separação de Responsabilidades

### **1. ROUTES (Roteamento)**
Localização: `backend/src/routes/`

**Responsabilidades:**
- Mapear URLs para handlers apropriados
- Definir métodos HTTP (GET, POST, PUT, DELETE)
- Validar estrutura básica das requisições

**Exemplo:**
```typescript
// questaoRoutes.ts
router.get('/api/questoes', QuestaoController.listar);
router.get('/api/questoes/:id', QuestaoController.buscarPorId);
router.post('/api/questoes', QuestaoController.criar);
router.put('/api/questoes/:id', QuestaoController.atualizar);
router.delete('/api/questoes/:id', QuestaoController.deletar);
```

### **2. CONTROLLERS (Lógica da Aplicação)**
Localização: `backend/src/controllers/`

**Responsabilidades:**
- Processar requisições HTTP
- Validar parâmetros e dados de entrada
- Implementar regras de negócio
- Chamar o Model para operações de banco de dados
- Enviar respostas HTTP apropriadas
- Tratar e mapear erros

**Exemplo:**
```typescript
export const QuestaoController = {
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const questoesBanco = await QuestaoModel.listarTodas();
      const formatadas = questoesBanco.map(mapearParaFrontend);
      return res.status(200).json(formatadas);
    } catch (error) {
      return next(error);
    }
  },

  async criar(req: Request, res: Response, next: NextFunction) {
    const dados = req.body as QuestaoPayload;

    // Validação
    const faltando = CAMPOS_OBRIGATORIOS.filter((campo) => !dados[campo]);
    if (faltando.length > 0) {
      return next(new HttpError(400, `Campos obrigatórios ausentes: ${faltando.join(', ')}`));
    }

    try {
      const novoId = await QuestaoModel.criar(dados);
      return res.status(201).json({ mensagem: 'Questão criada com sucesso!', id: novoId });
    } catch (error) {
      return next(error);
    }
  }
};
```

### **3. MODELS (Camada de Dados)**
Localização: `backend/src/models/`

**Responsabilidades:**
- Centralizar todas as operações de banco de dados
- Usar Prisma Client para consultas tipadas
- Implementar lógica de transformação de dados
- Retornar dados estruturados para o Controller

---

## 🗄️ Models - Camada de Dados

### Função do Model

O Model é a **única camada que acessa o banco de dados** através do Prisma Client. Todos os Controllers devem passar por ele.

```typescript
// questaoModel.ts
import { prisma } from '../lib/prisma.js';

export const QuestaoModel = {
  // READ: Obter todas as questões
  async listarTodas(): Promise<QuestaoBanco[]> {
    const questoes = await prisma.questao.findMany({
      include: { disciplina: true },
      orderBy: [{ disciplina: { nome_disc: 'asc' } }, { cod_quest: 'asc' }],
    });
    return questoes.map(mapearQuestao);
  },

  // READ: Obter questão por ID
  async buscarPorId(id: number): Promise<QuestaoBanco | undefined> {
    const questao = await prisma.questao.findUnique({
      where: { cod_quest: id },
      include: { disciplina: true },
    });
    return questao ? mapearQuestao(questao) : undefined;
  },

  // CREATE: Inserir nova questão
  async criar(dados: QuestaoPayload): Promise<number> {
    const questao = await prisma.questao.create({
      data: {
        cod_disc: dados.cod_disc,
        enunciado: dados.enunciado,
        alternativa_A: dados.alternativa_A,
        alternativa_B: dados.alternativa_B,
        alternativa_C: dados.alternativa_C,
        alternativa_D: dados.alternativa_D,
        alternativa_correta: dados.alternativa_correta.toLowerCase(),
        dificuldade: dados.dificuldade,
      },
      select: { cod_quest: true },
    });
    return questao.cod_quest;
  },

  // UPDATE: Atualizar questão
  async atualizar(id: number, dados: Partial<QuestaoPayload>): Promise<number> {
    const questaoExiste = await prisma.questao.findUnique({
      where: { cod_quest: id },
      select: { cod_quest: true },
    });
    if (!questaoExiste) return 0;

    await prisma.questao.update({
      where: { cod_quest: id },
      data: {
        ...(dados.cod_disc !== undefined && { cod_disc: dados.cod_disc }),
        ...(dados.enunciado !== undefined && { enunciado: dados.enunciado }),
        // ... outros campos
      },
    });
    return 1;
  },

  // DELETE: Remover questão
  async deletar(id: number): Promise<number> {
    const questao = await prisma.questao.findUnique({
      where: { cod_quest: id },
      select: { cod_quest: true },
    });
    if (!questao) return 0;

    await prisma.questao.delete({
      where: { cod_quest: id },
    });
    return 1;
  },
};
```

### Configuração do Prisma Client

```typescript
// lib/prisma.ts
import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../../../generated/prisma/client.js';

const databaseUrl = process.env.DATABASE_URL ?? 'file:./src/database/db.sqlite';
const adapter = new PrismaBetterSqlite3({ url: databaseUrl });

export const prisma = new PrismaClient({ adapter });
```

---

## 🎮 Controllers - Camada de Lógica

### Responsabilidades Principais

1. **Receber requisição HTTP** via Express.js
2. **Validar dados** de entrada
3. **Chamar o Model** para operações de banco de dados
4. **Mapear respostas** para o formato esperado pelo frontend
5. **Retornar resposta HTTP** com status code apropriado
6. **Tratar erros** e passar para middleware de erro

### Exemplo Completo: Criar Questão

```typescript
async criar(req: Request, res: Response, next: NextFunction) {
  const dados = req.body as QuestaoPayload;

  // 1️⃣ VALIDAÇÃO DE CAMPOS OBRIGATÓRIOS
  const faltando = CAMPOS_OBRIGATORIOS.filter((campo) => !dados[campo]);
  if (faltando.length > 0) {
    return next(new HttpError(400, `Campos obrigatórios ausentes: ${faltando.join(', ')}`));
  }

  // 2️⃣ VALIDAÇÃO DE FORMATO
  const alternativa = String(dados.alternativa_correta).toLowerCase() as LetraValida;
  if (!LETRAS_VALIDAS.includes(alternativa)) {
    return next(new HttpError(400, 'alternativa_correta deve ser: a, b, c ou d.'));
  }

  try {
    // 3️⃣ CHAMAR MODEL PARA INSERIR NO BD
    const novoId = await QuestaoModel.criar({ 
      ...dados, 
      alternativa_correta: alternativa 
    });

    // 4️⃣ RETORNAR RESPOSTA DE SUCESSO
    return res.status(201).json({ 
      mensagem: 'Questão criada com sucesso!', 
      id: novoId 
    });
  } catch (error: unknown) {
    // 5️⃣ TRATAR ERROS
    if (error instanceof Error && error.message === 'DUPLICADO') {
      return next(new HttpError(409, 'Esta questão já está cadastrada.'));
    }
    return next(error);
  }
}
```

### Mapeamento de Dados (DTO Pattern)

O Controller mapeia dados do banco para o formato esperado pelo frontend:

```typescript
// Tipo retornado pelo banco (Model)
interface QuestaoBanco {
  cod_quest: number;
  cod_disc: number;
  enunciado: string;
  alternativa_A: string;
  alternativa_B: string;
  alternativa_C: string;
  alternativa_D: string;
  alternativa_correta: 'a' | 'b' | 'c' | 'd';
  dificuldade: string;
  materia: string;
}

// Tipo retornado para o frontend (DTO)
interface QuestaoFrontend {
  id: number;
  materia: string;
  nivel: string;
  enunciado: string;
  alternativas: [string, string, string, string];
  correta: number;
}

// Função de mapeamento
const mapearParaFrontend = (q: QuestaoBanco): QuestaoFrontend => {
  const mapaLetraParaIndex: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 };

  return {
    id: q.cod_quest,
    materia: q.materia,
    nivel: q.dificuldade,
    enunciado: q.enunciado,
    alternativas: [q.alternativa_A, q.alternativa_B, q.alternativa_C, q.alternativa_D],
    correta: mapaLetraParaIndex[q.alternativa_correta] ?? 0,
  };
};
```

---

## 🚦 Routes - Camada de Roteamento

As rotas conectam URLs HTTP aos handlers do Controller:

```typescript
// questaoRoutes.ts
import express from 'express';
import { QuestaoController } from '../controllers/questaoController.js';

const router = express.Router();

// GET /api/questoes - Listar todas
router.get('/api/questoes', QuestaoController.listar);

// GET /api/questoes/:id - Buscar por ID
router.get('/api/questoes/:id', QuestaoController.buscarPorId);

// POST /api/questoes - Criar nova
router.post('/api/questoes', QuestaoController.criar);

// PUT /api/questoes/:id - Atualizar
router.put('/api/questoes/:id', QuestaoController.atualizar);

// DELETE /api/questoes/:id - Deletar
router.delete('/api/questoes/:id', QuestaoController.deletar);

export default router;
```

---

## 🔧 Operações CRUD

### CREATE (Criar)

**Requisição:**
```http
POST /api/questoes HTTP/1.1
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

**Resposta (201 Created):**
```json
{
  "mensagem": "Questão criada com sucesso!",
  "id": 100
}
```

**Fluxo:**
1. Route recebe POST em `/api/questoes`
2. Controller valida campos obrigatórios
3. Controller valida formato de alternativa_correta
4. Model cria registro via `prisma.questao.create()`
5. Controller retorna 201 com ID da nova questão

---

### READ (Ler)

**Listar todas:**
```http
GET /api/questoes HTTP/1.1
```

**Resposta (200 OK):**
```json
[
  {
    "id": 11154,
    "materia": "Matemática",
    "nivel": "fácil",
    "enunciado": "Quanto é 8 + 7?",
    "alternativas": ["13", "14", "15", "16"],
    "correta": 2
  },
  // ... mais questões
]
```

**Buscar por ID:**
```http
GET /api/questoes/11154 HTTP/1.1
```

**Resposta (200 OK):**
```json
{
  "id": 11154,
  "materia": "Matemática",
  "nivel": "fácil",
  "enunciado": "Quanto é 8 + 7?",
  "alternativas": ["13", "14", "15", "16"],
  "correta": 2
}
```

**Fluxo:**
1. Route recebe GET
2. Controller valida parâmetros (ex: ID deve ser número)
3. Model busca via `prisma.questao.findMany()` ou `findUnique()`
4. Controller mapeia resultado para DTO
5. Controller retorna 200 com dados

---

### UPDATE (Atualizar)

**Requisição:**
```http
PUT /api/questoes/11154 HTTP/1.1
Content-Type: application/json

{
  "enunciado": "Quanto é 8 + 7 (revisado)?",
  "dificuldade": "médio"
}
```

**Resposta (200 OK):**
```json
{
  "mensagem": "Questão 11154 atualizada com sucesso!"
}
```

**Fluxo:**
1. Route recebe PUT com ID
2. Controller valida ID (deve ser número)
3. Controller valida que pelo menos um campo foi enviado
4. Model atualiza via `prisma.questao.update()`
5. Controller retorna 200 com mensagem de sucesso

---

### DELETE (Deletar)

**Requisição:**
```http
DELETE /api/questoes/11154 HTTP/1.1
```

**Resposta (200 OK):**
```json
{
  "mensagem": "Questão 11154 deletada com sucesso!"
}
```

**Fluxo:**
1. Route recebe DELETE com ID
2. Controller valida ID
3. Model deleta via `prisma.questao.delete()`
4. Controller retorna 200

---

## 📊 Fluxo de Requisição Completo

```
┌─────────────────────────────────────────────────────────────┐
│ 1. FRONTEND (Browser)                                       │
│    fetch('/api/questoes', { method: 'POST', body: JSON })   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP POST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. EXPRESS SERVER                                           │
│    Recebe requisição em req.body                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. ROUTER (questaoRoutes.ts)                                │
│    POST /api/questoes → QuestaoController.criar             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. CONTROLLER (questaoController.ts)                        │
│    ✓ Valida campos obrigatórios                             │
│    ✓ Valida formato de alternativa_correta                  │
│    ✓ Chama QuestaoModel.criar()                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. MODEL (questaoModel.ts)                                  │
│    prisma.questao.create({                                  │
│      data: { cod_disc, enunciado, alternativas, ... }       │
│    })                                                       │
└────────────────────────┬────────────────────────────────────┘
                         │ SQL Query
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. PRISMA CLIENT                                            │
│    Traduz para SQL e executa no SQLite                      │
└────────────────────────┬────────────────────────────────────┘
                         │ SQL
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. SQLITE DATABASE                                          │
│    INSERT INTO questao (...)                                │
│    VALUES (...)                                             │
└────────────────────────┬────────────────────────────────────┘
                         │ Novo ID gerado
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. MODEL (retorna)                                          │
│    questao.cod_quest (ID inserido)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. CONTROLLER (retorna)                                     │
│    res.status(201).json({                                   │
│      mensagem: 'Questão criada com sucesso!',               │
│      id: novoId                                             │
│    })                                                       │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP Response 201
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. FRONTEND (recebe)                                       │
│     response.json() → { mensagem, id }                      │
│     Atualiza UI com novo ID ou exibe confirmação            │
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 Exemplos de Implementação

### Exemplo 1: Listar Questões (READ)

**Frontend:**
```javascript
async function carregarQuestoes() {
  const resposta = await fetch('/api/questoes');
  const questoes = await resposta.json();
  // questoes = [{ id, materia, nivel, enunciado, alternativas, correta }, ...]
}
```

**Backend - Route:**
```typescript
router.get('/api/questoes', QuestaoController.listar);
```

**Backend - Controller:**
```typescript
async listar(req: Request, res: Response, next: NextFunction) {
  try {
    const questoesBanco = await QuestaoModel.listarTodas();
    const formatadas = questoesBanco.map(mapearParaFrontend);
    return res.status(200).json(formatadas);
  } catch (error) {
    return next(error);
  }
}
```

**Backend - Model:**
```typescript
async listarTodas(): Promise<QuestaoBanco[]> {
  const questoes = await prisma.questao.findMany({
    include: { disciplina: true },
    orderBy: [{ disciplina: { nome_disc: 'asc' } }, { cod_quest: 'asc' }],
  });
  return questoes.map(mapearQuestao);
}
```

---

### Exemplo 2: Criar Questão (CREATE)

**Frontend:**
```javascript
const novaQuestao = {
  cod_disc: 82211,
  enunciado: "Pergunta?",
  alternativa_A: "Opção A",
  alternativa_B: "Opção B",
  alternativa_C: "Opção C",
  alternativa_D: "Opção D",
  alternativa_correta: "a",
  dificuldade: "fácil"
};

const res = await fetch('/api/questoes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(novaQuestao)
});
const { id } = await res.json();
```

**Backend - Route:**
```typescript
router.post('/api/questoes', QuestaoController.criar);
```

**Backend - Controller:**
```typescript
async criar(req: Request, res: Response, next: NextFunction) {
  const dados = req.body as QuestaoPayload;

  // Validação
  const faltando = CAMPOS_OBRIGATORIOS.filter((campo) => !dados[campo]);
  if (faltando.length > 0) {
    return next(new HttpError(400, `Faltam: ${faltando.join(', ')}`));
  }

  try {
    const novoId = await QuestaoModel.criar(dados);
    return res.status(201).json({ 
      mensagem: 'Questão criada com sucesso!', 
      id: novoId 
    });
  } catch (error) {
    return next(error);
  }
}
```

**Backend - Model:**
```typescript
async criar(dados: QuestaoPayload): Promise<number> {
  const questao = await prisma.questao.create({
    data: {
      cod_disc: dados.cod_disc,
      enunciado: dados.enunciado,
      alternativa_A: dados.alternativa_A,
      alternativa_B: dados.alternativa_B,
      alternativa_C: dados.alternativa_C,
      alternativa_D: dados.alternativa_D,
      alternativa_correta: dados.alternativa_correta.toLowerCase(),
      dificuldade: dados.dificuldade,
    },
    select: { cod_quest: true },
  });
  return questao.cod_quest;
}
```

---

## 📈 Benefícios da Arquitetura MVC

| Aspecto | Benefício |
|--------|-----------|
| **Separação de Responsabilidades** | Cada camada tem uma função clara e específica |
| **Testabilidade** | Controllers e Models podem ser testados isoladamente |
| **Manutenibilidade** | Mudanças no BD só afetam o Model |
| **Escalabilidade** | Fácil adicionar novos Controllers/Models |
| **Reutilização** | Models podem ser usados por múltiplos Controllers |
| **Segurança** | Validação centralizada no Controller |

---

## 🔐 Tratamento de Erros

O projeto implementa middleware de erro customizado:

```typescript
// errorHandler.ts
export const errorHandler = (error: Error, req: Request, res: Response) => {
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({ mensagem: error.message });
  }

  console.error('Erro não tratado:', error);
  return res.status(500).json({ mensagem: 'Erro interno do servidor' });
};
```

Todos os Controllers retornam erros via `next(new HttpError(status, mensagem))`.

---

**Documentação gerada em:** 2026-06-13
