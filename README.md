# 📸 Portfólio de Fotografia

Sistema web desenvolvido para gerenciamento e apresentação de um portfólio fotográfico.

O projeto foi desenvolvido como atividade acadêmica, utilizando uma arquitetura composta por Front-end, Back-end e banco de dados PostgreSQL.

## 🎯 Objetivo

Criar uma aplicação web que permita cadastrar, visualizar, editar e excluir fotografias de um portfólio, além de organizar as imagens por categorias.

O projeto está sendo desenvolvido de forma incremental, com funcionalidades implementadas e apresentadas em entregas.

## 🛠️ Tecnologias utilizadas

### Front-end

- React
- Vite
- JavaScript
- HTML
- CSS

### Back-end

- Node.js
- Express
- Multer
- CORS
- Dotenv

### Banco de dados

- PostgreSQL

### Controle de versão

- Git
- GitHub

## 📸 Entrega 1 — CRUD de Fotografias

**Status: Concluída ✅**

A primeira entrega apresenta o módulo de gerenciamento de fotografias, com integração entre Front-end, Back-end e banco de dados PostgreSQL.

### Funcionalidades

- ✅ Cadastro de fotografias
- ✅ Upload de imagens
- ✅ Visualização das fotografias
- ✅ Edição de fotografias
- ✅ Alteração da imagem durante a edição
- ✅ Exclusão de fotografias
- ✅ Persistência dos dados no PostgreSQL

### Vídeo de apresentação

[Apresentação da Entrega 1 — YouTube](https://www.youtube.com/watch?v=ESrsMs0mQxE)

## 🗂️ Entrega 2 — Gerenciamento de Categorias

**Status: Implementada e testada ✅**

A segunda entrega amplia o sistema com o gerenciamento de categorias e sua integração com as fotografias.

### Funcionalidades

- ✅ Cadastro de categorias
- ✅ Listagem de categorias
- ✅ Edição de categorias
- ✅ Exclusão de categorias
- ✅ Validação para impedir a exclusão de categorias vinculadas a fotografias
- ✅ Integração das categorias com o PostgreSQL
- ✅ Seleção de categorias no cadastro de fotografias
- ✅ Seleção e atualização da categoria durante a edição de fotografias
- ✅ Utilização do identificador da categoria (`categoria_id`) no relacionamento com as fotografias

### Testes realizados

- ✅ Cadastro, edição e exclusão de categorias
- ✅ Validação de categorias duplicadas
- ✅ Bloqueio da exclusão de categorias vinculadas a fotografias
- ✅ Cadastro e edição de fotografias com categorias
- ✅ Verificação da persistência das alterações após atualizar a página

### Vídeo de apresentação

### Vídeo de apresentação

[Apresentação da Entrega 2 — Gerenciamento de Categorias](https://www.youtube.com/watch?v=e8FydD59qys)

## 🗂️ Estrutura do projeto

```text
portfolio-fotografo/
├── backend/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── ...
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
├── .gitignore
└── README.md
```

## 🗄️ Banco de dados

O projeto utiliza PostgreSQL.

**Banco de dados:** `portfolio_fotografo`

### Tabela de fotografias

A tabela de fotografias armazena os dados e o endereço das imagens cadastradas.

Campos principais:

- `id`: identificador da fotografia
- `titulo`: título da fotografia
- `descricao`: descrição da fotografia
- `imagem_url`: endereço da imagem
- `categoria`: campo de texto legado mantido no banco
- `categoria_id`: identificador da categoria relacionada
- `data_criacao`: data de criação do registro

### Tabela de categorias

A tabela `categorias` armazena as categorias disponíveis no portfólio.

Campos principais:

- `id`: identificador da categoria
- `nome`: nome da categoria, com restrição de unicidade
- `data_criacao`: data de criação do registro

O relacionamento entre as tabelas permite associar fotografias às categorias cadastradas.

## ⚙️ Como executar o projeto

### 1. Pré-requisitos

É necessário ter instalado:

- Node.js
- npm
- PostgreSQL
- Git

### 2. Configuração do banco de dados

Crie o banco de dados `portfolio_fotografo` no PostgreSQL e configure as credenciais de acesso utilizadas pelo Back-end.

As tabelas e o relacionamento entre fotografias e categorias devem estar configurados conforme a estrutura utilizada no projeto.

### 3. Configuração do Back-end

Entre na pasta do Back-end:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` dentro da pasta `backend`, com as configurações necessárias para a conexão com o PostgreSQL.

Execute o servidor:

```bash
node server.js
```

O Back-end será executado em:

http://localhost:3000

### 4. Configuração do Front-end

Abra outro terminal e entre na pasta do Front-end:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

O Front-end será disponibilizado pelo Vite, normalmente em:

http://localhost:5173

## 🔗 API REST

A aplicação utiliza uma API REST para comunicação entre o Front-end e o Back-end.

### Fotografias

| Método | Endpoint               | Operação                    |
| ------ | ---------------------- | --------------------------- |
| GET    | `/api/fotografias`     | Lista fotografias           |
| GET    | `/api/fotografias/:id` | Busca uma fotografia por ID |
| POST   | `/api/fotografias`     | Cadastra uma fotografia     |
| PUT    | `/api/fotografias/:id` | Atualiza uma fotografia     |
| DELETE | `/api/fotografias/:id` | Exclui uma fotografia       |

### Categorias

| Método | Endpoint              | Operação                                                           |
| ------ | --------------------- | ------------------------------------------------------------------ |
| GET    | `/api/categorias`     | Lista categorias                                                   |
| POST   | `/api/categorias`     | Cadastra uma categoria                                             |
| PUT    | `/api/categorias/:id` | Atualiza uma categoria                                             |
| DELETE | `/api/categorias/:id` | Exclui uma categoria, desde que não esteja vinculada a fotografias |

## 👥 Participantes

- Danilo A. O. Silva

## 📋 Board do projeto

[Portfólio de Fotografia — Entregas](https://github.com/users/DaniloAOSilva/projects/1/views/1)

## 💻 Repositório GitHub

[Portfólio de Fotografia — Código-fonte](https://github.com/DaniloAOSilva/portfolio-fotografo)

## 🚀 Deploy

O projeto ainda não possui um endereço de publicação informado nesta documentação.

**Link do deploy:** a adicionar após a publicação.

## 📌 Status do projeto

### Entrega 1 — CRUD de Fotografias

**Concluída ✅**

CRUD de fotografias desenvolvido, testado e integrado ao PostgreSQL.

### Entrega 2 — Gerenciamento de Categorias

**Implementada e testada ✅**

Gerenciamento de categorias integrado ao PostgreSQL, com associação entre categorias e fotografias.

### Entrega 3 — CRUD de Clientes

**Planejada ⏳**

Próxima funcionalidade prevista: gerenciamento de clientes.

### Entrega 4 — Agendamentos

**Planejada ⏳**

Funcionalidade prevista para uma etapa posterior do projeto.
