# 📸 Portfólio de Fotografia

Sistema web desenvolvido para gerenciamento e apresentação de um portfólio fotográfico.

O projeto foi desenvolvido como atividade acadêmica, utilizando uma arquitetura com Front-end, Back-end e banco de dados PostgreSQL.

## 🎯 Objetivo

Criar uma aplicação web que permita cadastrar, visualizar, editar e excluir fotografias de um portfólio.

A primeira entrega do projeto foi focada no desenvolvimento completo do módulo de fotografias, incluindo o upload e gerenciamento das imagens.

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

A primeira entrega apresenta o módulo completo de gerenciamento de fotografias.

### Funcionalidades

- ✅ Cadastro de fotografias
- ✅ Upload de imagens
- ✅ Visualização das fotografias
- ✅ Edição de fotografias
- ✅ Alteração da imagem durante a edição
- ✅ Exclusão de fotografias
- ✅ Integração entre Front-end, Back-end e PostgreSQL

## 🗂️ Estrutura do projeto

```text
portfolio-fotografo/
│
├── backend/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

## 🗄️ Banco de dados

O projeto utiliza PostgreSQL.

Banco de dados utilizado:

portfolio_fotografo

Tabela principal da Entrega 1:

CREATE TABLE fotografias (
id SERIAL PRIMARY KEY,
titulo VARCHAR(150) NOT NULL,
descricao TEXT,
imagem_url TEXT NOT NULL,
categoria VARCHAR(100),
data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

## ⚙️ Como executar o projeto

### 1. Pré-requisitos

É necessário ter instalado:

- Node.js
- npm
- PostgreSQL
- Git

### 2. Configuração do Back-end

Entre na pasta do back-end:

cd backend

Instale as dependências:

npm install

Crie o arquivo .env dentro da pasta backend com as configurações do PostgreSQL.

Depois, execute o servidor:

node server.js

O back-end será executado em:

http://localhost:3000

### 3. Configuração do Front-end

Abra outro terminal e entre na pasta do front-end:

cd frontend

Instale as dependências:

npm install

Execute o projeto:

npm run dev

O front-end será disponibilizado pelo Vite, normalmente em:

http://localhost:5173

## 🔗 API

A aplicação utiliza uma API REST para comunicação entre o Front-end e o Back-end.

Principais operações da Entrega 1:

GET /api/fotografias
GET /api/fotografias/:id
POST /api/fotografias
PUT /api/fotografias/:id
DELETE /api/fotografias/:id

## 👥 Participantes

- Danilo A. O. Silva

## 📋 Board do projeto

Link do Board:

[Portfólio de Fotografia - Entregas](https://github.com/users/DaniloAOSilva/projects/1/views/1)

## 💻 Repositório GitHub

Link do projeto:

https://github.com/DaniloAOSilva/portfolio-fotografo

## 🎥 Vídeo da Entrega 1

Vídeo de apresentação da funcionalidade desenvolvida:

- [Apresentação da Entrega 1 — YouTube](https://www.youtube.com/watch?v=ESrsMs0mQxE)

## 🚀 Deploy

O projeto também contará com uma versão publicada para demonstração.

Link do deploy:

- A adicionar

## 📌 Status do projeto

### Entrega 1

**Concluída ✅**

CRUD de fotografias desenvolvido e integrado ao banco de dados PostgreSQL.

### Próximas entregas

- Entrega 2 — A definir
- Entrega 3 — A definir
- Entrega 4 — A definir
