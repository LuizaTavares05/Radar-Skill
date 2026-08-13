# Backend — API Spring Boot

API REST responsável por autenticação (JWT) e gerenciamento de skills técnicas.

## Tecnologias

- Java 21
- Spring Boot 4.1
- Spring Security (autenticação com JWT — jjwt)
- Spring Data JPA (Hibernate)
- Springdoc OpenAPI (Swagger UI)
- PostgreSQL
- Maven Wrapper

## Pré-requisitos

- **JDK 21** instalado e configurado no `PATH`;
- **PostgreSQL** em execução, com o script `database/SistemaSkill.sql` aplicado (criação do banco, das tabelas e dados iniciais);
- Maven (o projeto inclui o wrapper `mvnw`, dispensando instalação global).

## Configuração de Ambiente

As configurações são definidas em `src/main/resources/application.properties`, que lê **variáveis de ambiente** com valores padrão:

| Variável          | Padrão                            | Descrição                                  |
| ----------------- | --------------------------------- | ------------------------------------------ |
| `DB_HOST`         | `localhost`                       | Host do PostgreSQL                         |
| `DB_PORT`         | `5432`                            | Porta do PostgreSQL                        |
| `DB_NAME`         | `radar_skill`                     | Nome do banco de dados                     |
| `DB_USERNAME`     | `postgres`                        | Usuário do banco                           |
| `DB_PASSWORD`     | `postgres`                        | Senha do banco                             |
| `SERVER_PORT`     | `8080`                            | Porta HTTP da API (execução manual via Maven) |
| `JWT_SECRET`      | `talentario-dev-secret-...-32bytes` | Chave secreta do JWT (mínimo 32 caracteres) |
| `JWT_EXPIRATION`  | `86400000`                        | Tempo de expiração do token (milissegundos) |
| `APP_CORS_ORIGINS`| `http://localhost:5173` | Origens permitidas no CORS     |

> **Portas configuráveis:** todos os valores acima têm **padrões que já funcionam**, mas podem ser alterados via `.env` conforme a necessidade (ex.: porta ocupada). Ao rodar via Docker Compose, a porta do host do backend é controlada por `BACKEND_PORT` no `.env` da raiz.
>
> **CORS (dev):** a origem `http://localhost:5173` do default de `APP_CORS_ORIGINS` corresponde ao dev server do Vite (`FRONTEND_DEV_PORT` no `frontend/.env`). Se essa porta for alterada, atualize `APP_CORS_ORIGINS` com a nova origem (`http://localhost:<nova-porta>`), senão o navegador bloqueia as chamadas cross-origin.

Para execução local, copie o modelo e preencha os valores:

```bash
cp .env.example .env
```

A biblioteca `springboot4-dotenv` carrega o arquivo `.env` automaticamente durante a execução via Maven. O arquivo `.env` **não deve ser versionado**.

## Execução Manual

A partir da pasta `backend/`:

```bash
# Linux/macOS
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```

A API sobe na porta **8080**.

## Documentação Swagger

A interface do Swagger UI fica disponível em:

```
http://localhost:8080/swagger-ui.html
```

O contrato OpenAPI (JSON) está em:

```
http://localhost:8080/v3/api-docs
```

### Como testar

1. Faça login (caso já tenha um usuário cadastrado) em `POST /api/auth/login` informando `email` e `senha` de um usuário cadastrado;
2. Copie o campo `token` da resposta;
3. Clique no botão **Authorize** no Swagger UI e informe `Bearer <token>`.

### Endpoints públicos

| Método | Rota                  | Descrição                    |
| ------ | --------------------- | ---------------------------- |
| POST   | `/api/auth/cadastrar` | Cadastro de usuário          |
| POST   | `/api/auth/login`     | Autenticação e emissão de JWT |

Os demais endpoints (`/api/skills` e `/api/skills/catalogo`) exigem token JWT.
