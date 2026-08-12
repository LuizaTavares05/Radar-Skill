# Mobile — React Native + Expo

Aplicativo mobile de gerenciamento de skills, construído com React Native e Expo.

## Tecnologias

- React Native 0.81
- Expo ~54
- TypeScript
- AsyncStorage (persistência da sessão)
- lucide-react-native (ícones)
- react-native-svg · expo-linear-gradient · expo-font · react-native-safe-area-context

## Pré-requisitos

- **Node.js** 18 ou superior;
- Aplicativo **Expo Go** instalado no dispositivo físico, ou **emulador Android/iOS** configurado;
- Backend em execução (via Docker Compose ou manual) na mesma rede do dispositivo.

## Conexão com a API (Importante)

A URL base da API é lida da variável de ambiente `EXPO_PUBLIC_API_URL` em `src/api/client.ts`:

```ts
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "";
```

A URL **não tem valor padrão**: sem `.env`, o app não consegue conectar ao backend.

Em um **dispositivo físico**, usar `http://localhost:8080` **não funciona**: o `localhost` aponta para o próprio celular, e não para a máquina que executa o backend. É necessário utilizar o **IP local da máquina** na rede Wi-Fi.

### Como configurar

1. Descubra o IP local da sua máquina (ex.: `192.168.1.15`):

   ```bash
   # Windows
   ipconfig

   # Linux/macOS
   ip addr
   ```

2. Copie o arquivo `.env.example` para `.env` e ajuste o IP:

   ```bash
   # Windows
   copy .env.example .env

   # Linux/macOS
   cp .env.example .env
   ```

   ```bash
   EXPO_PUBLIC_API_URL=http://192.168.X.X:8080
   ```

3. Garanta que o celular e a máquina estejam na **mesma rede Wi-Fi** e que a porta `8080` esteja liberada no firewall.

> **Funciona nos dois modos:** o app conecta ao backend tanto em execução **manual** (`mvn`, porta `SERVER_PORT` do `backend/.env`) quanto via **Docker** (porta `BACKEND_PORT` do `.env` da raiz) — ambos com default `8080`. Se alguma dessas portas for alterada, basta ajustar `EXPO_PUBLIC_API_URL` no `.env` do mobile para a porta real do backend em execução.

Após alterar a variável, reinicie o servidor de desenvolvimento do Expo.

## Execução

```bash
cd mobile
npm install
npx expo start
```

No terminal, escaneie o **QR Code** com o aplicativo **Expo Go** (dispositivo físico) ou pressione `a` para emulador Android / `i` para simulador iOS.

## Scripts

| Comando              | Descrição                   |
| -------------------- | --------------------------- |
| `npm run start`      | Inicia o Metro bundler      |
| `npm run android`    | Inicia e abre no Android    |
| `npm run ios`        | Inicia e abre no iOS        |
| `npm run web`        | Inicia no navegador         |
