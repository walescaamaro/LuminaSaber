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
 
- **Back-end:** Node.js + Express + Morgan
- **Front-end:** HTML, CSS, JavaScript (ES Modules)
- **Testes de API:** REST Client (VSCode)
- **Banco de Dados:** SQLite — *[repositório separado](https://github.com/walescaamaro/DataBase-LuminaSaber)*
- **Versionamento:** Git
---
 
## 📁 Estrutura do Projeto
 
```
LuminaSaber/
├── public/                         # Arquivos front-end
│   ├── home.html                   # Tela inicial
│   ├── cadastro.html               # Página de cadastro
│   ├── cadastro_exercicios.html    # Cadastro de exercícios
│   ├── seleção_disciplinas.html    # Seleção de disciplinas
│   ├── tela_exercicios/            # Módulo de exercícios
│   │   ├── exercicios.html
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       ├── main.js
│   │       ├── carregarQuestoes.js
│   │       └── filtros.js
│   └── assets/                     # Imagens (onda.png, logo.png, etc.)
├── backend/                        # Servidor Node.js
│   ├── server.js
│   ├── routes.js
│   ├── rotas.http                  # Testes de rotas (REST Client)
│   ├── data/
│   │   └── questoes.json           # Dados temporários em memória
│   └── package.json
└── README.md
```
 
---
 
## ⚙️ Como Rodar o Projeto
 
### Pré-requisitos
 
- [Node.js](https://nodejs.org/) instalado (versão 18 ou superior)
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
 
| Método | Rota | Descrição | Status de Retorno |
|--------|------|-----------|--------|
| `GET` | `/api/questoes` | Lista todas as questões | 200 |
| `GET` | `/api/questoes/:id` | Busca questão por ID | 200 / 404 |
| `POST` | `/api/questoes` | Cria nova questão | 201 / 400 |
| `PUT` | `/api/questoes/:id` | Atualiza questão existente | 200 / 404 |
| `DELETE` | `/api/questoes/:id` | Remove uma questão | 200 / 404 |
 
> **Observação:** No momento, os dados são mantidos em memória (arquivo `questoes.json`). A integração com o banco de dados PostgreSQL está prevista para as próximas versões.
 
### Exemplo de requisição POST
 
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
 
## 📚 Disciplinas Disponíveis

- 📐 Matemática
- 📖 Português
- 🔬 Ciências
- 🌍 Geografia
- 🏛️ História
- 🎨 Artes
- 🇺🇸 Inglês
 
---
 
## 🗄️ Banco de Dados
 
O projeto possui um modelo relacional completo desenvolvido em **SQLite**. Os scripts estão organizados em um repositório dedicado:
 
📂 **[github.com/walescaamaro/DataBase-LuminaSaber](https://github.com/walescaamaro/DataBase-LuminaSaber)**
 
O repositório contém os seguintes arquivos:
 
| Arquivo | Descrição |
|---------|-----------|
| `tabelas.sql` | Criação de todas as tabelas e relacionamentos |
| `insert.sql` | Inserção dos dados iniciais |
| `consultas.sql` | Consultas de exemplo (SELECT, JOIN, filtros) |
| `atualização de dados (update).sql` | Exemplos de atualização de registros |
| `delete.sql` | Exemplos de exclusão de registros |
 
As tabelas do modelo são: `USUARIO` · `DISCIPLINA` · `CONTEÚDO` · `QUESTÃO` · `HISTÓRICO` · `PASTA` · `ANOTAÇÃO` · `SUPORTE` · `RELATÓRIO` · `ESTUDA` · `POSSUI` · `CONTÉM`
 
---
 
## 📌 Funcionalidades
  
### Previstas para próximas versões 🔄
 
- Cadastro e login de usuários (com autenticação por perfil: aluno e administrador)
- Temporizador de estudo e definição de meta de questões
- Relatório de desempenho ao fim de cada sessão (acertos, erros, pontos fortes e áreas de melhoria)
- Exibição de dicas ao errar uma questão
- Canto de anotações ao encerrar a sessão de estudos
- Módulo de anotações com criação de pastas, edição, exclusão e exportação em PDF
- Módulo de histórico com opção de refazer questões anteriores
- Painel do administrador (configurações gerais e gerenciamento de usuários)
- Integração com o banco de dados PostgreSQL
- Sistema adaptativo que prioriza conteúdos com maior dificuldade para o aluno

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais no **Instituto Federal de Educação, Ciência e Tecnologia da Paraíba (IFPB)**.
