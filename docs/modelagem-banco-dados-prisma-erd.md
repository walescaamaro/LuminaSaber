# 📊 Modelagem de Banco de Dados com Prisma e Diagrama ERD

## 📋 Sumário
- [Visão Geral do Banco de Dados](#visão-geral-do-banco-de-dados)
- [Schema Prisma](#schema-prisma)
- [Entidades e Atributos](#entidades-e-atributos)
- [Relacionamentos](#relacionamentos)
- [Diagrama ERD](#diagrama-erd)
- [Operações de Inicialização](#operações-de-inicialização)

---

## 🎯 Visão Geral do Banco de Dados

O LuminaSaber utiliza **SQLite** com **Prisma ORM** para gerenciar o banco de dados. A modelagem foi realizada através do arquivo `prisma/schema.prisma`, que define:

- **12 tabelas** (entidades)
- **Relacionamentos** um-para-muitos (1:N) e muitos-para-muitos (N:N)
- **Tipos de dados** apropriados para cada campo
- **Constraints** e validações a nível de banco de dados

### Características Principais

✅ **Tipo SQLite**: Leve, sem necessidade de servidor separado  
✅ **ORM Prisma**: Type-safe, com autocompletar e migrações automáticas  
✅ **Constraints**: Validações a nível de banco (PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK)  
✅ **Enums**: Tipos específicos como `Tipo` (administrador | aluno)

---

## 🗂️ Schema Prisma

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "sqlite"
}

// ============ ENUMS ============

enum Tipo {
  administrador
  aluno
}

// ============ MODELS (TABELAS) ============

model Usuario {
  cod_usuario  Int       @id @default(autoincrement())
  nome         String
  email        String
  senha        String    @unique
  grau_escolar String?   // NULL para administrador
  data_nasc    DateTime
  tipo         Tipo

  // Relacionamentos
  pastas       Pasta[]
  historicos   Historico[]
  anotacoes    Anotacao[]
  estuda       Estuda[]

  @@map("USUARIO")
}

model Disciplina {
  cod_disc  Int       @id @default(autoincrement())
  nome_disc String

  // Relacionamentos
  conteudos Conteudo[]
  questoes  Questao[]
  estuda    Estuda[]

  @@map("disciplina")
}

// ... (outras tabelas)
```

---

## 🏗️ Entidades e Atributos

### 1. **USUARIO** (Usuários)

**Propósito:** Armazenar dados de usuários (alunos e administradores)

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `cod_usuario` | INT | PK, AUTO_INCREMENT | Identificador único do usuário |
| `nome` | VARCHAR(40) | NOT NULL | Nome completo |
| `email` | VARCHAR(100) | NOT NULL | Email para contato e login |
| `senha` | VARCHAR(20) | NOT NULL, UNIQUE | Senha criptografada (única) |
| `grau_escolar` | VARCHAR(70) | NULL | Ex: "1° ano", "5° ano" (NULL para admin) |
| `data_nasc` | DATE | NOT NULL | Data de nascimento |
| `tipo` | ENUM | NOT NULL | "administrador" ou "aluno" |

**Constraint Check:**
```sql
CHECK ((tipo = 'aluno' AND grau_escolar IS NOT NULL) 
       OR (tipo = 'administrador'))
```
→ Alunos devem ter grau_escolar, administradores não

---

### 2. **disciplina** (Disciplinas)

**Propósito:** Catalogar disciplinas escolares (Matemática, Português, etc.)

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `cod_disc` | INT | PK, AUTO_INCREMENT | Identificador único |
| `nome_disc` | VARCHAR(50) | NOT NULL | Nome da disciplina |

**Exemplo de dados:**
- Matemática
- Português
- Ciências
- Inglês
- História
- Geografia
- Artes

---

### 3. **questao** (Questões de Exercício)

**Propósito:** Armazenar questões de múltipla escolha

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `cod_quest` | INT | PK, AUTO_INCREMENT | Identificador único |
| `cod_disc` | INT | NOT NULL, FK | Referência à disciplina |
| `enunciado` | VARCHAR(700) | NOT NULL | Texto da questão |
| `alternativa_A` | VARCHAR(100) | NOT NULL | Opção A |
| `alternativa_B` | VARCHAR(100) | NOT NULL | Opção B |
| `alternativa_C` | VARCHAR(100) | NOT NULL | Opção C |
| `alternativa_D` | VARCHAR(100) | NOT NULL | Opção D |
| `alternativa_correta` | CHAR(1) | NOT NULL | 'a', 'b', 'c' ou 'd' |
| `dificuldade` | VARCHAR(20) | NOT NULL | "fácil", "médio" ou "difícil" |

**Constraint Check:**
```sql
CHECK (alternativa_correta IN ('a','b','c','d'))
```

**Relacionamentos:**
- FK: `cod_disc` → `disciplina.cod_disc`

---

### 4. **Conteudo** (Conteúdos Didáticos)

**Propósito:** Agrupar questões por tópicos de conteúdo

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `cod_conteudo` | INT | PK, AUTO_INCREMENT | Identificador único |
| `cod_disc` | INT | NOT NULL, FK | Referência à disciplina |
| `descricao` | VARCHAR(100) | NOT NULL | Descrição do conteúdo |

**Relacionamentos:**
- FK: `cod_disc` → `disciplina.cod_disc`

---

### 5. **PASTA** (Pastas de Anotações)

**Propósito:** Organizar anotações em pastas por usuário

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `cod_pasta` | INT | PK, AUTO_INCREMENT | Identificador único |
| `cod_usuario` | INT | NULL, FK | Usuário proprietário |
| `data_criacao` | DATE | NOT NULL | Quando foi criada |
| `nome_pasta` | VARCHAR(100) | NOT NULL | Nome descritivo |

**Relacionamentos:**
- FK: `cod_usuario` → `USUARIO.cod_usuario`

---

### 6. **Anotacao** (Anotações)

**Propósito:** Permitir que usuários façam anotações durante estudos

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `cod_anotacao` | INT | PK, AUTO_INCREMENT | Identificador único |
| `cod_pasta` | INT | NOT NULL, FK | Pasta onde está armazenada |
| `cod_usuario` | INT | NOT NULL, FK | Usuário dono |
| `titulo` | VARCHAR(100) | NOT NULL | Título da anotação |
| `conteudo` | TEXT | NOT NULL | Texto da anotação |
| `data_criacao` | DATE | NOT NULL | Data de criação |

**Relacionamentos:**
- FK: `cod_pasta` → `PASTA.cod_pasta`
- FK: `cod_usuario` → `USUARIO.cod_usuario`

---

### 7. **Historico** (Histórico de Respostas)

**Propósito:** Rastrear respostas do usuário para relatórios

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `cod_resposta` | INT | PK, AUTO_INCREMENT | Identificador único |
| `cod_usuario` | INT | NOT NULL, FK | Usuário que respondeu |
| `cod_quest` | INT | NOT NULL, FK | Questão respondida |
| `data_resposta` | DATE | NOT NULL | Quando foi respondida |
| `status` | VARCHAR(10) | NOT NULL | "Acertou" ou "Errou" |

**Relacionamentos:**
- FK: `cod_usuario` → `USUARIO.cod_usuario`
- FK: `cod_quest` → `questao.cod_quest`

---

### 8. **Estuda** (Disciplinas Estudadas)

**Propósito:** Registrar metas e tempo por disciplina por usuário

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `cod_usuario` | INT | NOT NULL, FK, PK | Usuário |
| `cod_disc` | INT | NOT NULL, FK, PK | Disciplina |
| `meta` | INT | NOT NULL | Meta de questões |
| `tempo` | TIME | NOT NULL | Tempo dedicado (HH:MM:SS) |

**Relacionamentos:**
- FK: `cod_usuario` → `USUARIO.cod_usuario`
- FK: `cod_disc` → `disciplina.cod_disc`

---

### 9. **Relatorio** (Relatórios de Desempenho)

**Propósito:** Armazenar análise de desempenho do usuário

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `cod_relatorio` | INT | PK, AUTO_INCREMENT | Identificador único |
| `meta` | INT | NOT NULL | Meta de questões |
| `total_acertos` | INT | NOT NULL | Quantidade de acertos |
| `percentual_acertos` | INT | NOT NULL | Porcentagem (0-100) |
| `pontos_fortes` | VARCHAR(100) | NOT NULL | Áreas com bom desempenho |
| `areas_melhorias` | VARCHAR(100) | NOT NULL | Áreas para melhorar |

---

### 10. **Suporte** (Ticket de Suporte)

**Propósito:** Gerenciar solicitações de suporte dos usuários

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `cod_suporte` | INT | PK, AUTO_INCREMENT | Identificador único |
| `email` | VARCHAR(100) | NOT NULL | Email do solicitante |
| `tipo_problema` | VARCHAR(40) | NOT NULL | "Dúvidas", "Erros", "Sugestão" |
| `descricao` | TEXT | NOT NULL | Descrição detalhada |

---

### 11. **Contem** (Tabela de Relacionamento)

**Propósito:** Relacionar questões com conteúdos (N:N)

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `cod_conteudo` | INT | NOT NULL, FK, PK | Conteúdo |
| `cod_quest` | INT | NOT NULL, FK, PK | Questão |

**Relacionamentos:**
- FK: `cod_conteudo` → `Conteudo.cod_conteudo`
- FK: `cod_quest` → `questao.cod_quest`

---

### 12. **Possui** (Tabela de Relacionamento)

**Propósito:** Relacionar pastas com anotações (N:N)

| Campo | Tipo | Constraints | Descrição |
|-------|------|-------------|-----------|
| `cod_pasta` | INT | NOT NULL, FK, PK | Pasta |
| `cod_anotacao` | INT | NOT NULL, FK, PK | Anotação |

**Relacionamentos:**
- FK: `cod_pasta` → `PASTA.cod_pasta`
- FK: `cod_anotacao` → `Anotacao.cod_anotacao`

---

## 🔗 Relacionamentos

### Relacionamentos Um-para-Muitos (1:N)

| De | Para | Tipo | Descrição |
|----|------|------|-----------|
| **Usuario** | **Pasta** | 1:N | Um usuário tem muitas pastas |
| **Usuario** | **Historico** | 1:N | Um usuário responde muitas questões |
| **Usuario** | **Anotacao** | 1:N | Um usuário faz muitas anotações |
| **Disciplina** | **Questao** | 1:N | Uma disciplina tem muitas questões |
| **Disciplina** | **Conteudo** | 1:N | Uma disciplina tem muitos conteúdos |
| **Pasta** | **Anotacao** | 1:N | Uma pasta contém muitas anotações |
| **Questao** | **Historico** | 1:N | Uma questão tem muitas respostas |

### Relacionamentos Muitos-para-Muitos (N:N)

| Tabela 1 | Tabela 2 | Tabela de Junção | Descrição |
|----------|----------|------------------|-----------|
| **Questao** | **Conteudo** | **Contem** | Uma questão pode estar em múltiplos conteúdos |
| **Pasta** | **Anotacao** | **Possui** | Uma anotação pode estar em múltiplas pastas |
| **Usuario** | **Disciplina** | **Estuda** | Um usuário estuda múltiplas disciplinas |

---

## 📊 Diagrama ERD

```mermaid
erDiagram
    USUARIO ||--o{ PASTA : "cria"
    USUARIO ||--o{ ANOTACAO : "escreve"
    USUARIO ||--o{ HISTORICO : "responde"
    USUARIO ||--o{ ESTUDA : "estuda"
    
    DISCIPLINA ||--o{ QUESTAO : "contém"
    DISCIPLINA ||--o{ CONTEUDO : "posiciona"
    DISCIPLINA ||--o{ ESTUDA : "é estudada por"
    
    QUESTAO ||--o{ HISTORICO : "respondida em"
    QUESTAO ||--o{ CONTEM : "classificada em"
    QUESTAO ||--o{ POSSUI : "contém"
    
    PASTA ||--o{ ANOTACAO : "agrupa"
    PASTA ||--o{ POSSUI : "referencia"
    
    ANOTACAO ||--o{ CONTEM : "trata de"
    ANOTACAO ||--o{ POSSUI : "está em"
    
    CONTEUDO ||--o{ CONTEM : "agrupa"
    
    USUARIO {
        int cod_usuario PK
        string nome
        string email
        string senha UK
        string grau_escolar
        datetime data_nasc
        enum tipo
    }
    
    DISCIPLINA {
        int cod_disc PK
        string nome_disc
    }
    
    QUESTAO {
        int cod_quest PK
        int cod_disc FK
        string enunciado
        string alternativa_A
        string alternativa_B
        string alternativa_C
        string alternativa_D
        char alternativa_correta
        string dificuldade
    }
    
    PASTA {
        int cod_pasta PK
        int cod_usuario FK
        date data_criacao
        string nome_pasta
    }
    
    ANOTACAO {
        int cod_anotacao PK
        int cod_pasta FK
        int cod_usuario FK
        string titulo
        text conteudo
        date data_criacao
    }
    
    HISTORICO {
        int cod_resposta PK
        int cod_usuario FK
        int cod_quest FK
        date data_resposta
        string status
    }
    
    CONTEUDO {
        int cod_conteudo PK
        int cod_disc FK
        string descricao
    }
    
    ESTUDA {
        int cod_usuario FK PK
        int cod_disc FK PK
        int meta
        time tempo
    }
    
    CONTEM {
        int cod_conteudo FK PK
        int cod_quest FK PK
    }
    
    POSSUI {
        int cod_pasta FK PK
        int cod_anotacao FK PK
    }
    
    RELATORIO {
        int cod_relatorio PK
        int meta
        int total_acertos
        int percentual_acertos
        string pontos_fortes
        string areas_melhorias
    }
    
    SUPORTE {
        int cod_suporte PK
        string email
        string tipo_problema
        text descricao
    }
```

---

## 🔄 Operações de Inicialização

### 1. **Migração** (Criação do Schema)

A migração cria todas as tabelas e constraints:

```bash
npm run migrate
```

Script: `backend/src/database/migration.ts`

Executa SQL para criar:
- 12 tabelas com constraints apropriadas
- Enum `Tipo` (administrador | aluno)
- Foreign keys para relacionamentos
- Unique constraints em campos sensíveis

---

### 2. **Seed** (Carga de Dados Iniciais)

O seed popula o banco com dados de exemplo:

```bash
npm run seed
```

Script: `backend/src/database/seed.ts`

Insere:
- **10 usuários** (2 admin, 8 alunos)
- **7 disciplinas** (Matemática, Português, etc.)
- **35 questões** com 4 alternativas cada
- **12 conteúdos** temáticos
- **5 pastas** de anotações
- **5 anotações** exemplo
- **5 históricos** de respostas
- Registros de suporte e relatórios

---

## 💡 Consultas SQL Exemplo

### Listar todas as questões de Matemática

```sql
SELECT q.cod_quest, q.enunciado, q.dificuldade, d.nome_disc
FROM questao q
INNER JOIN disciplina d ON q.cod_disc = d.cod_disc
WHERE d.nome_disc = 'Matemática'
ORDER BY q.dificuldade;
```

**Equivalente em Prisma:**
```typescript
const questoes = await prisma.questao.findMany({
  where: { disciplina: { nome_disc: 'Matemática' } },
  include: { disciplina: true },
  orderBy: { dificuldade: 'asc' }
});
```

---

### Contar acertos de um usuário

```sql
SELECT d.nome_disc, COUNT(*) AS total_respostas, 
       SUM(CASE WHEN h.status = 'Acertou' THEN 1 ELSE 0 END) AS acertos
FROM historico h
INNER JOIN questao q ON h.cod_quest = q.cod_quest
INNER JOIN disciplina d ON q.cod_disc = d.cod_disc
WHERE h.cod_usuario = 76554
GROUP BY d.nome_disc;
```

---

### Relacionamento: Anotação em múltiplas pastas

```sql
SELECT a.titulo, p.nome_pasta
FROM anotacao a
INNER JOIN possui ps ON a.cod_anotacao = ps.cod_anotacao
INNER JOIN PASTA p ON ps.cod_pasta = p.cod_pasta
WHERE a.cod_usuario = 76554;
```

---

## 📈 Diagrama Conceitual

```
┌─────────────────────────────────────────────────────┐
│                  LUMINA SABER                       │
│         Plataforma de Aprendizado                   │
└─────────────────────────────────────────────────────┘

┌────────────┐
│  USUARIO   │ (Aluno ou Administrador)
│ (10 dados) │
└────────────┘
      │
      ├─→ PASTA (5 dados) ─→ ANOTACAO (5 dados)
      ├─→ HISTORICO (5 dados)
      └─→ ESTUDA (7 dados)
            ↓
      ┌────────────────┐
      │  DISCIPLINA    │ (7 disciplinas: Mat, Port, etc)
      │  (7 dados)     │
      └────────────────┘
            │
            ├─→ QUESTAO (35 questões)
            │     ├─→ Alternativas A, B, C, D
            │     ├─→ Dificuldade (fácil, médio, difícil)
            │     └─→ HISTORICO (rastreia respostas)
            │
            └─→ CONTEUDO (12 conteúdos)
                  ↓
              CONTEM (tabela N:N)
                  ↓
              QUESTAO (classifica questões)

RELATORIO ─→ Análise de desempenho
SUPORTE ──→ Tickets de atendimento
```

---

**Documentação gerada em:** 2026-06-13  
**Schema Prisma:** `prisma/schema.prisma`  
**Banco de Dados:** SQLite (`backend/src/database/db.sqlite`)
