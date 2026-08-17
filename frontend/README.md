# Frontend Web — React + Vite

Aplicação Web de gerenciamento de skills, construída com React e TypeScript.

## Tecnologias

- React 18
- TypeScript
- Vite (build e dev server)
- Tailwind CSS 4
- lucide-react (ícones)
- Axios
- `localStorage` (persistência da sessão — `src/auth.ts`)

## Pré-requisitos

- **Node.js** 18 ou superior;
- **npm** (ou yarn/pnpm).

## Configuração da API

A URL base da API é definida pela variável de ambiente `VITE_API_BASE_URL` em `src/api/client.ts`:

```ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
```

Como configurar:

Copie o arquivo `.env.example` para `.env` na pasta `frontend/` e ajuste a URL para onde o backend está em execução:

   ```bash
   # Windows
   copy .env.example .env

   # Linux/macOS
   cp .env.example .env
   ```

   ```bash
   VITE_API_BASE_URL=http://localhost:8080
   ```

   - Backend **manual** (`mvn`): use a porta `SERVER_PORT` do `backend/.env` (default `8080`);
   
   O navegador chama o backend **diretamente** (requisição cross-origin), por isso o CORS do backend precisa permitir a origem — `http://localhost:5173` já está no default de `APP_CORS_ORIGINS`.

> **IMPORTANTE (CORS):** a origem de dev é `http://localhost:<FRONTEND_DEV_PORT>`. Se você alterar `FRONTEND_DEV_PORT` no `frontend/.env` (default `5173`), adicione `http://localhost:<nova-porta>` em `APP_CORS_ORIGINS` no `backend/.env` — caso contrário o navegador bloqueia as requisições.

**OBS: Em produção (Docker):** deixe `VITE_API_BASE_URL` **vazio** no build. As requisições `/api/*` ficam relativas e o **Nginx** (`nginx.conf`) as encaminha para o backend — mesmo comportamento, sem chamada cross-origin.

## Execução

```bash
cd frontend
npm install
npm run dev
```

A aplicação fica disponível em http://localhost:5173 (configurável via `FRONTEND_DEV_PORT` no `frontend/.env`, default `5173`; se ocupada, o Vite falha e pede que você troque a variável — `strictPort`).

> **Portas configuráveis:** em produção (Docker), a porta do frontend é controlada por `FRONTEND_PORT` no `.env` da raiz (padrão `8081`). Em desenvolvimento, a URL da API é definida por `VITE_API_BASE_URL` (deve apontar para a porta real do backend em execução) e a porta do dev server por `FRONTEND_DEV_PORT` (lembre de sincronizar com `APP_CORS_ORIGINS` no backend).

> O projeto não possui script `start`; o comando de desenvolvimento é `npm run dev`.

## Build de produção

```bash
npm run build
```

O build gera o diretório `dist/`, que é o artefato servido pelo contêiner Nginx na execução via Docker Compose.

## Estrutura do Código

```
src/
├── api/          # Cliente HTTP e funções de API (auth, skills)
├── components/   # Componentes de UI reutilizáveis
├── data/         # Dados estáticos (catálogo de skills)
├── pages/        # Páginas (Login, Register, Dashboard)
├── types/        # Tipos e conversores compartilhados
├── auth.ts       # Sessão e token (localStorage)
└── App.tsx       # Shell da aplicação e navegação entre páginas
```
