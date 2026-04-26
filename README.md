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

---

## 👩‍💻 Equipe

| Nome | Matrícula |
|------|-----------|
| Rayssa Priscila Silva Nascimento | 20241780013 |
| Walesca Amaro Rodrigues | 20241780019 |

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

- **Back-end:** Node.js + Express + Morgan
- **Front-end:** HTML, CSS, JavaScript
- **Fontes:** Google Fonts (DM Sans)
- **Testes de API:** REST Client (VSCode)
- **Versionamento:** Git + GitHub

---

## 📁 Estrutura do Projeto

```
LuminaSaber/
├── (teste)home.html/        # Tela inicial (home)
│   ├── home.html
│   └── assets (imagens)
├── tela_exercícios/         # Módulo de exercícios
│   ├── exercicios.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   ├── carregarQuestoes.js
│   │   └── filtros.js
│   └── data/
│       └── questoes.json
├── backend/                 # Servidor Node.js
│   ├── server.js
│   ├── rotas.http
│   └── package.json
├── seleção_disciplinas.html
└── cadastro.html
```

---

## ⚙️ Como Rodar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/walescaamaro/LuminaSaber.git

# 2. Entre na pasta do backend
cd LuminaSaber/backend

# 3. Instale as dependências
npm install

# 4. Inicie o servidor
node server.js
```

Acesse no navegador: **http://localhost:3000**

---

## 🔌 Rotas da API (padrão REST)

Base URL: `http://localhost:3000`

| Método | Rota | Descrição | Status |
|--------|------|-----------|--------|
| `GET` | `/api/questoes` | Lista todas as questões | 200 |
| `GET` | `/api/questoes/:id` | Busca questão por ID | 200 / 404 |
| `POST` | `/api/questoes` | Cria nova questão | 201 / 400 |
| `PUT` | `/api/questoes/:id` | Atualiza questão existente | 200 / 404 |
| `DELETE` | `/api/questoes/:id` | Remove uma questão | 200 / 404 |

### Exemplo de requisição POST

```json
POST /api/questoes
Content-Type: application/json

{
  "nivel": "Fácil",
  "materia": "Matemática",
  "enunciado": "Quanto é 2 + 2?",
  "alternativas": ["1", "2", "3", "4"],
  "correta": 4
}
```

---

## 📚 Disciplinas Disponíveis

- 📐 Matemática
- 📖 Português
- 🔬 Ciências
- 🌍 Geografia
- 🏛️ História
- 🎨 Artes
- 🇬🇧 Inglês

---

## 🗄️ Banco de Dados

O projeto possui um modelo relacional com as seguintes tabelas:

`USUARIO` · `DISCIPLINA` · `CONTEÚDO` · `QUESTÃO` · `HISTÓRICO` · `PASTA` · `ANOTAÇÃO` · `SUPORTE` · `RELATÓRIO` · `ESTUDA` · `POSSUI` · `CONTÉM`

---

## 📌 Funcionalidades Previstas

- [x] Tela Home com navegação
- [x] Seleção de disciplinas
- [x] Tela de exercícios com filtro por matéria
- [x] Feedback de acerto/erro nas questões
- [x] API REST com CRUD de questões
- [x] Testes de rotas com REST Client
- [ ] Cadastro e login de usuários
- [ ] Relatório de desempenho
- [ ] Canto de anotações
- [ ] Módulo de histórico
- [ ] Painel do administrador

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais no **Instituto Federal de Educação, Ciência e Tecnologia da Paraíba (IFPB)**.
