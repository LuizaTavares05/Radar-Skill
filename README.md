# Radar Skill

[![Repository](https://img.shields.io/static/v1?label=repositorio&message=LuizaTavares05%2FRadar-Skill&color=blue)](https://github.com/LuizaTavares05/Radar-Skill)

Plataforma de gerenciamento de skills técnicas de desenvolvedores. O usuário realiza cadastro e autenticação via **JWT**, consulta um **catálogo de skills** e associa skills à sua conta definindo nível de proficiência e descrição. A aplicação é composta por uma API REST e dois clientes que a consomem: uma aplicação **Web** (React) e um aplicativo **Mobile** (React Native).

## Tecnologias

| Camada            | Tecnologias                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| Backend           | Java 21 · Spring Boot 4.1 · Spring Security (JWT) · Spring Data JPA · Springdoc OpenAPI · Lombok |
| Frontend (Web)    | React 18 · TypeScript · Vite · Tailwind CSS 4 · Fetch API · lucide-react    |
| Mobile            | React Native 0.81 · Expo 54 · TypeScript · AsyncStorage · lucide-react-native · react-native-svg |
| Banco de dados    | PostgreSQL 16                                                               |
| Infraestrutura    | Docker Compose · Nginx · Maven Wrapper                                      |

## Estrutura do Repositório

```
.
├── backend/            # API REST Spring Boot (autenticação JWT e gerenciamento de skills)
│   ├── database/       # Script SQL de criação do schema e dados iniciais (SistemaSkill.sql)
│   └── src/            # Código-fonte Java (controllers, services, repositories, entidades, DTOs)
├── frontend/           # Aplicação Web React (Vite + TypeScript)
├── mobile/             # Aplicativo React Native (Expo)
├── docker-compose.yml  # Orquestração de banco, backend e frontend
└── .env.example        # Modelo das variáveis de ambiente do Docker Compose
```

## Execução via Docker Compose

O `docker-compose.yml` orquestra três serviços: **banco PostgreSQL**, **backend** e **frontend web**.

> **Nota:** Os três serviços podem ser executados individualmente de forma manual. Cada um possui um `README.md` próprio com o passo a passo dedicado em sua respectiva pasta.

### Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução.

### Passo a passo

1. Configure as variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

2. Suba a stack:

   ```bash
   docker compose up -d
   ```

3. Verifique os serviços:

   ```bash
   docker compose ps
   ```

### Serviços e portas

| Serviço   | Porta no host | Acesso                                        |
| --------- | ------------- | --------------------------------------------- |
| db        | 5432          | PostgreSQL (interno da rede Docker)           |
| backend   | 8080          | http://localhost:8080/swagger-ui.html         |
| frontend  | 8081          | http://localhost:8081                         |

> **Portas configuráveis:** todos os serviços têm portas padrão que já funcionam, mas podem ser alteradas conforme a necessidade via variáveis de ambiente no `.env` da raiz: `DB_PORT` (banco, padrão `5432`), `BACKEND_PORT` (backend, padrão `8080`) e `FRONTEND_PORT` (frontend, padrão `8081`). Veja o [`.env.example`](.env.example) para a lista completa.

> **Nota:** Sugiro configurar a porta do banco de dados diferente da porta onde está localizado o PostgreSQL nativo do Windows, caso tenha.

Na primeira inicialização, o contêiner do PostgreSQL executa automaticamente o script **`backend/database/SistemaSkill.sql`**, responsável pela criação das tabelas e pela carga inicial do catálogo de skills (15 skills). O script é montado em `/docker-entrypoint-initdb.d/` e roda apenas na primeira criação do volume de dados.

O frontend servido na porta `8081` utiliza um Nginx que encaminha as requisições `/api/*` para o serviço `backend` na porta `8080`.

## App Mobile (Expo)

O aplicativo é o unico que **não é executado via Docker**. O ecossistema do React Native/Expo executa o JavaScript em um **runtime nativo** de um dispositivo físico (via aplicativo **Expo Go**) ou de um **emulador Android/iOS**, com o bundle servido pelo servidor Metro. Não existe um binário containerizável no fluxo de desenvolvimento do Expo, e a emulação exige acesso ao hardware do host (câmera, sensores, aceleração gráfica).

## Docker + Mobile juntos

Se quiser, pode rodar o **mobile** sem a necessidade de o rodar o banco e backend manualmente, siga o passo a paso acima, rodando os 3 serviços pelo **docker compose**, e siga esse próximo passo a passo para configurar o firewall. caso a rede Wi-Fi for do tipo **privada**.

### Firewall (redes privadas — Windows)

Se a rede Wi-Fi for do tipo **privada**, o dispositivo físico pode não alcançar a API do host. Para liberar rapidamente, execute no PowerShell (como administrador):

```powershell
netsh advfirewall firewall add rule name="Radar API 8080" dir=in action=allow protocol=TCP localport=8080 profile=any
netsh advfirewall firewall add rule name="Docker Backend Private" dir=in action=allow program="C:\SEU_CAMINHO_DO_DOCKER\DockerDesktop\resources\com.docker.backend.exe" profile=private
```

> Ajuste `C:\SEU_CAMINHO_DO_DOCKER\` para o diretório real da sua instalação do Docker Desktop (o executável é o `com.docker.backend.exe` dentro de `resources\`). Exemplo comum: `C:\Program Files\Docker\Docker\resources\com.docker.backend.exe`.

Após essa configuração, para iniciar execute:

```bash
cd mobile
npm install
npx expo start
```

Escaneie o QR Code exibido no terminal com o aplicativo **Expo Go**. É necessário ajustar a URL da API para o IP local da máquina (ver [mobile/README.md](mobile/README.md)).

---

<div align="center">

Desenvolvido por **Luiza Tavares**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lutavares05/)

</div>