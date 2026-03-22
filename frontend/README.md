# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
/* ============================================================
   GESTÃO DE ATIVOS - MAPA COMPLETO DAS PÁGINAS
   ============================================================

   🗺️  O SITE POSSUI 5 PÁGINAS NO TOTAL
   ════════════════════════════════════════════════════════════

   ┌─────────────────────────────────────────────────────────┐
   │                                                         │
   │   PÁGINA 1 - LOGIN                                      │
   │   ├── Condição: isAuthView = true  E  isLoginMode = true│
   │   ├── Local no código: Linhas ~XXX                      │
   │   └── Descrição: Formulário de entrada com email/senha  │
   │                                                         │
   ├─────────────────────────────────────────────────────────┤
   │                                                         │
   │   PÁGINA 2 - CADASTRO                                   │
   │   ├── Condição: isAuthView = true  E  isLoginMode = false│
   │   ├── Local no código: Linhas ~XXX                      │
   │   └── Descrição: Formulário de registro com 6 campos    │
   │                                                         │
   ├─────────────────────────────────────────────────────────┤
   │                                                         │
   │   PÁGINA 3 - EQUIPAMENTOS                               │
   │   ├── Condição: isAuthView = false  E  currentTab = 'equipamentos'│
   │   ├── Local no código: Linhas ~XXX + função renderTable │
   │   └── Descrição: Tabela com lista de ativos da empresa  │
   │                                                         │
   ├─────────────────────────────────────────────────────────┤
   │                                                         │
   │   PÁGINA 4 - USUÁRIOS                                   │
   │   ├── Condição: isAuthView = false  E  currentTab = 'usuarios'│
   │   ├── Local no código: Linhas ~XXX + função renderTable │
   │   └── Descrição: Tabela com usuários do sistema         │
   │                                                         │
   ├─────────────────────────────────────────────────────────┤
   │                                                         │
   │   PÁGINA 5 - MODAL (NOVO EQUIPAMENTO)                   │
   │   ├── Condição: isModalOpen = true                      │
   │   ├── Local no código: Linhas ~XXX                      │
   │   └── Descrição: Formulário flutuante para cadastro     │
   │                                                         │
   └─────────────────────────────────────────────────────────┘


   🔔 ELEMENTO GLOBAL - TOAST
   ├── Aparece em qualquer página quando toastMessage.show = true
   └── Duração: 3 segundos | Cores: verde (sucesso) / vermelho (erro)


   🧭 CONTROLE DE NAVEGAÇÃO ENTRE PÁGINAS
   ════════════════════════════════════════════════════════════

   [isAuthView]          → true = Páginas 1 e 2 (Login/Cadastro)
                           false = Páginas 3 e 4 (Sistema)

   [isLoginMode]         → true = Página 1 (Login)
                           false = Página 2 (Cadastro)

   [currentTab]          → 'equipamentos' = Página 3
                           'usuarios' = Página 4

   [isModalOpen]         → true = Página 5 (Modal)
                           false = Modal fechado

   [currentSession.role] → 'admin' = vê Página 4 + botão "Novo"
                           'user' = não vê Página 4


   📍 ESTADO INICIAL (ao abrir o site)
   ════════════════════════════════════════════════════════════
   isAuthView = true   → Mostra PÁGINA 1 (Login)
   isLoginMode = true  → Mostra PÁGINA 1 (Login)
   isModalOpen = false → Modal fechado

   ============================================================ */
