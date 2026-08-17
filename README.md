# Radar Skill

[![Repository](https://img.shields.io/static/v1?label=repositorio&message=LuizaTavares05%2FRadar-Skill&color=blue)](https://github.com/LuizaTavares05/Radar-Skill)

Plataforma de gerenciamento de skills técnicas de desenvolvedores. O usuário realiza cadastro e autenticação via **JWT**, consulta um **catálogo de skills** e associa skills à sua conta definindo nível de proficiência e descrição. A aplicação é composta por uma API REST e dois clientes que a consomem: uma aplicação **Web** (React) e um aplicativo **Mobile** (React Native).

## Tecnologias

| Camada            | Tecnologias                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| Backend           | Java 21 · Spring Boot 4.1 · Spring Security (JWT) · Spring Data JPA · Springdoc OpenAPI · Lombok |
| Frontend (Web)    | React 18 · TypeScript · Vite · Tailwind CSS 4 · Fetch API   |
| Mobile            | React Native 0.81 · Expo 54 · TypeScript · AsyncStorage |
| Banco de dados    | PostgreSQL 16                                                               |
| Infraestrutura    | Docker Compose · Nginx                                    |

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

## Funcionalidades

### Autenticação

- Cadastro de usuário
- Login com autenticação JWT
- Senha armazenada de forma criptografada
- Opção de gravar senha para preenchimento automático no próximo acesso
- Logout

### Gerenciamento de Skills

- Consulta ao catálogo de skills
- Associação de skills à conta do usuário
- Definição de nível de proficiência
- Adição de descrição personalizada
- Edição de skills associadas
- Exclusão de skills
- Pesquisa por nome
- Filtro por categoria
- Visualização das skills cadastradas

### Plataformas

- Aplicação Web responsiva
- Aplicativo Mobile
- Web e Mobile consumindo a mesma API REST

## Execução via Docker Compose

O `docker-compose.yml` orquestra os quatro serviços da aplicação: **banco PostgreSQL**, **backend**, **frontend web** e **mobile**.

> **Nota:** Os serviços também podem ser executados individualmente de forma manual. Cada um possui um `README.md` próprio com o passo a passo dedicado em sua respectiva pasta.

### Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e em execução.
- Aplicativo **Expo Go** instalado no seu celular e firewall configurado, caso sua rede seja privada (para testar a aplicação Mobile).

### Firewall (redes privadas — Windows)

Se a rede Wi-Fi for do tipo **privada**, o dispositivo físico pode não alcançar a API do host. Para liberar rapidamente, execute no PowerShell (como administrador):

```powershell
netsh advfirewall firewall add rule name="Radar API 8080" dir=in action=allow protocol=TCP localport=8080 profile=any
netsh advfirewall firewall add rule name="Docker Backend Private" dir=in action=allow program="C:\SEU_CAMINHO_DO_DOCKER\DockerDesktop\resources\com.docker.backend.exe" profile=private
```

> Ajuste `C:\SEU_CAMINHO_DO_DOCKER\` para o diretório real da sua instalação do Docker Desktop (o executável é o `com.docker.backend.exe` dentro de `resources\`). Exemplo comum: `C:\Program Files\Docker\Docker\resources\com.docker.backend.exe`.


### Passo a passo

1. Configure as variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

2. Suba a stack:

   ```bash
   docker compose up -d
   ```
   > Na primeira execução, o Docker realizará o download das imagens e construção dos serviços. Execuções posteriores utilizarão o cache das imagens e camadas já construídas.

3. Verifique os serviços:

   ```bash
   docker compose ps
   ```

### Serviços e portas

As portas utilizadas pela aplicação podem ser configuradas no arquivo `.env` localizado na raiz do projeto.

| Serviço   | Porta no host | Acesso                                        |
| --------- | ------------- | --------------------------------------------- |
| db        | 5432          | PostgreSQL (interno da rede Docker)           |
| backend   | 8080          | http://localhost:8080/swagger-ui.html         |
| frontend  | 8081          | http://localhost:8081                         |
| mobile    | 8082          | docker compose logs -f mobile (Expo Metro)    |

Consulte o [`.env.example`](.env.example) para visualizar todas as variáveis disponíveis.

> **Importante:** se o PostgreSQL já estiver instalado e executando diretamente no Windows, utilize uma porta diferente para o banco do Docker, caso haja conflito com a porta `5432`.

---

<div align="center">

Desenvolvido por **Luiza Tavares**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lutavares05/)

</div>
