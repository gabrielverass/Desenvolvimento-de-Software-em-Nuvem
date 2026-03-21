# Sistema de Gestão de Ativos 📦

Um sistema web moderno e escalável para gerenciamento de equipamento e ativos com controle de acesso baseado em funções (RBAC - Role-Based Access Control).

## 🎯 Visão Geral

Este projeto implementa uma plataforma completa de gestão de ativos organizacionais, permitindo:
- ✅ Registro e controle de equipamentos e patrimônios
- ✅ Gerenciamento de usuários com diferentes níveis de acesso
- ✅ Autenticação segura com JWT
- ✅ Interface moderna e responsiva
- ✅ API RESTful bem documentada com Swagger
- ✅ Infraestrutura containerizada com Docker

## 🏗️ Arquitetura da Solução

### Visão Geral
```
┌─────────────────┐         ┌──────────────────┐
│   Frontend      │         │    Backend       │
│   React/Vite   │◄───────►│   Express.js     │
│                 │  HTTP   │  Node.js         │
└─────────────────┘         └──────────────────┘
                                     │
                                     │ SQL
                                     │
                            ┌────────▼────────┐
                            │  Supabase       │
                            │  (PostgreSQL)   │
                            └─────────────────┘
```

## 🛠️ Stack Tecnológico

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js v5.2.1
- **Banco de Dados:** Supabase (PostgreSQL)
- **Autenticação:** JWT (jsonwebtoken)
- **Criptografia:** bcryptjs
- **Logging:** Winston v3.19.0
- **Documentação API:** Swagger UI
- **Containerização:** Docker
- **CORS:** Habilitado para requisições cross-origin

### Frontend
- **Framework:** React 19.2.4
- **Build Tool:** Vite 8.0.0
- **Estilos:** CSS Modules
- **Linting:** ESLint com suporte a React

### DevOps
- **Container:** Docker (Node 18-Alpine)
- **Variáveis de Ambiente:** dotenv

## 📁 Estrutura do Projeto

```
Desenvolvimento-de-Software-em-Nuvem/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── src/
│       ├── server.js                          # Entrada principal
│       ├── swagger.js                         # Configuração Swagger
│       ├── routes/
│       │   ├── userRoutes.js                 # Endpoints de usuários
│       │   └── ativosRoutes.js               # Endpoints de ativos
│       ├── controller/
│       │   ├── usercontroller.js             # Lógica de usuários
│       │   └── ativosController.js           # Lógica de ativos
│       ├── service/
│       │   ├── userServices.js               # Serviços de usuários
│       │   └── ativosServices.js             # Serviços de ativos
│       ├── database/
│       │   ├── conn.js                       # Conexão Supabase
│       │   ├── functions/
│       │   │   ├── userHelpers.js            # Operações DB de usuários
│       │   │   └── ativosHelpers.js          # Operações DB de ativos
│       │   └── validators/
│       │       ├── userValidators.js         # Validação de usuários
│       │       └── ativosValidator.js        # Validação de ativos
│       ├── middleware/
│       │   ├── authMiddleware.js             # Autenticação JWT
│       │   └── adminMiddleware.js            # Autorização Admin
│       ├── logger/
│       │   └── logger.js                     # Winston logger
│       └── utils/
│           ├── firstStartConfig.js           # Config inicial
│           └── testingEnv.js                 # Ambiente de teste
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── index.html
│   ├── public/
│   └── src/
│       ├── main.jsx                          # Entrada React
│       ├── App.jsx                           # Componente principal
│       ├── index.css                         # Estilos globais
│       ├── pages/
│       │   ├── Login.jsx                     # Página de login
│       │   ├── Equipamentos.jsx              # Gestão de ativos
│       │   └── Usuarios.jsx                  # Gestão de usuários
│       ├── styles/
│       │   └── App.css                       # Estilos App
│       └── utils/
│           └── constants.js                  # Constantes da aplicação
│
└── README.md                                  # Este arquivo
```

## 🚀 Como Começar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Docker (opcional, para containerização)
- Conta Supabase (para banco de dados)

### Instalação

#### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

#### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
```

### 🔧 Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend/` com as seguintes variáveis:

```env
#Configurações do Banco de Dados
SUPABASE_URL = URL DO SEU BANCO DO SUPABASE
SUPABASE_KEY = CHAVE DO SEU BANCO DO SUPABASE

#Configurações do JWT
JWT_SECRET = SECRETKEY DO JWT(IMPORTANTE, GERE UMA CHAVE LONGA)

#Configurações do admin padrão: (criado no primeiro acesso)
ADMIN_EMAIL = email para o seu admin padrão
ADMIN_PASSWORD =  senha do admin padrão

#Configurações de Usuário de teste(criado apenas quando o ambiente é configugrado para testes)
TEST_USER_EMAIL = email do seu usuário padrão
TEST_USER_PASSWORD = senha do seu usuário padrão

#Configuração de Admin de teste (criado apenas quando o ambiente é configugrado para testes)
TEST_ADMIN_EMAIL = 
TEST_ADMIN_PASSWORD = 

#Variável de ambiente para alterar o comportamento do sistema em ambiente de teste
#Valores possíveis: TRUE ou FALSE.
TEST_ENV = 

#Configurações do servidor
PORT = 
```

### ▶️ Executando o Projeto

#### Desenvolvimento Local

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Backend rodará em `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend rodará em `http://localhost:5173`

#### Com Docker

```bash
cd backend
docker build -t asset-management-system .
docker run -p 3000:3000 --env-file .env asset-management-system
```

## 📚 API Documentation

### Endpoints Disponíveis

#### 🔐 Autenticação (Público)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/login` | Login do usuário |

#### 👥 Gerenciamento de Usuários (Protegido - Admin)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/cadastrarusuario` | Criar novo usuário (admin only) |
| GET | `/listarusuarios` | Listar todos os usuários (admin only) |
| PUT | `/editarusuario/:id` | Atualizar dados do usuário (admin only) |
| PATCH | `/editarsenha/:id` | Alterar senha (admin only) |
| DELETE | `/deletarusuario/:id` | Deletar usuário (admin only) |

#### 📦 Gerenciamento de Ativos (Protegido)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/cadastrarequipamento` | Criar novo ativo |
| GET | `/listarequipamentos` | Listar todos os ativos |
| GET | `/buscarequipamento/:patrimonio` | Buscar ativo por patrimônio |
| PUT | `/editarequipamento/:id` | Atualizar ativo |
| DELETE | `/deletarequipamento/:id` | Deletar ativo |

#### 📖 Documentação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/docs` | Swagger UI com documentação completa da API |

### Exemplo de Requisição Autenticada

```javascript
// Headers obrigatórios
{
  "Authorization": "Bearer seu_token_jwt_aqui",
  "Content-Type": "application/json"
}
```

## 🗄️ Modelo de Dados

### Tabela: `users`
```sql
create table public.users (
  id bigint generated by default as identity not null,
  nome character varying not null default ''::character varying,
  cpf character varying not null,
  "dataNascimento" date not null,
  email character varying not null,
  hash character varying not null,
  cargo character varying not null,
  constraint users_pkey primary key (id),
  constraint users_cpf_key unique (cpf),
  constraint users_email_key unique (email)
) TABLESPACE pg_default;
```

### Tabela: `ativos`
```sql
create table public.ativos (
  id bigint generated by default as identity not null,
  patrimonio character varying not null,
  tipo character varying not null,
  nome character varying not null,
  setor character varying not null,
  propriedade character varying not null,
  status character varying not null,
  valor numeric not null default '0'::numeric,
  constraint ativos_pkey primary key (id),
  constraint ativos_patrimonio_key unique (patrimonio)
) TABLESPACE pg_default;
```

## 🔒 Segurança

- ✅ **Autenticação JWT:** Tokens assinados com chave secreta
- ✅ **Hashing de Senha:** Utilizando bcryptjs com salt rounds
- ✅ **RBAC:** Controle de acesso baseado em funções (ADMIN/USER)
- ✅ **Middleware de Autenticação:** Validação obrigatória de token
- ✅ **Middleware Admin:** Verificação de permissões administrativas
- ✅ **Variáveis de Ambiente:** Confidenciais nunca são commitadas
- ✅ **CORS:** Configurado para aceitar requisições seguras

## 📱 Funcionalidades Frontend

### 🔐 Página de Login
- Autenticação com email e senha
- Armazenamento seguro de token JWT
- Persistência de sessão com localStorage

### 📊 Página de Equipamentos
- Listagem de todos os ativos registrados
- Criar novo ativo
- Editar ativo existente
- Deletar ativo com confirmação
- Visualização em tabela interativa

### 👤 Página de Usuários (Admin only)
- Listagem de todos os usuários
- Criar novo usuário
- Editar perfil do usuário
- Alterar senha
- Deletar usuário
- Visualização de roles/cargos

### 🎨 Componentes Reutilizáveis
- Modais para CRUD
- Notificações Toast
- Badges de role
- Tabelas interativas
- Formulários validados

## 📊 Padrões de Código

### MVC Pattern
- **Models:** Estruturas no PostgreSQL
- **Views:** Componentes React
- **Controllers:** Lógica de requisição
- **Services:** Lógica de negócio
- **Helpers:** Operações de banco de dados

### Middleware Pattern
```javascript
// Ordem de execução
1. Express middleware (cors, json, etc)
2. Rotas públicas (login)
3. authMiddleware (validação JWT)
4. adminMiddleware (se necessário)
5. Controllers & Services
```

## 🧪 Testing

Para ambiente de teste, configure:
```env
TEST_ENV=true
```

## 📝 Scripts Disponíveis

### Backend
```bash
npm start          # Inicia o servidor
npm run dev        # Desenvolvimento com nodemon
```

### Frontend
```bash
npm run dev        # Inicia dev server Vite
npm run build      # Build para produção
npm run preview    # Preview do build
npm run lint       # ESLint
```

## 🐛 Troubleshooting

### Erro de Conexão Supabase
- Verifique `SUPABASE_URL` e `SUPABASE_KEY` no `.env`
- Confirme que o banco de dados está ativo

### Token JWT Inválido
- Verifique se o `JWT_SECRET` está configurado corretamente
- Certifique-se de enviar o token no header `Authorization: Bearer <token>`

### CORS Error
- Confirme que o frontend está na porta correta
- Verifique a configuração de CORS no backend

### Port Already in Use
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

## 📞 Suporte & Contribuições

Para issues e contribuições:
1. Descreva o problema ou feature
2. Forneça passos para reproduzir
3. Inclua evidências (screenshots, logs)
4. Considere submeter um pull request

## 📄 Licença

Este projeto é fornecido como está para fins educacionais e comerciais.

## 👨‍💻 Desenvolvedor

Desenvolvido como parte do curso de **Desenvolvimento de Software em Nuvem**.

---