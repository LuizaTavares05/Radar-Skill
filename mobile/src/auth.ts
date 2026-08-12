import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_TOKEN = "radar.token";
const CHAVE_EMAIL = "radar.emailUsuario";
const CHAVE_NOME = "radar.nomeUsuario";
const CHAVE_SENHA = "radar.senha";
const CHAVE_LEMBRAR = "radar.lembrar";

let token: string | null = null;
let emailUsuario: string | null = null;
let nomeUsuario: string | null = null;
let senhaUsuario: string | null = null;
let lembrarUsuario = false;

export function obterToken(): string | null {
  return token;
}

export function salvarToken(valor: string, persistir: boolean): void {
  token = valor;
  if (persistir) AsyncStorage.setItem(CHAVE_TOKEN, valor).catch(() => {});
  else AsyncStorage.removeItem(CHAVE_TOKEN).catch(() => {});
}

export function limparToken(): void {
  token = null;
  AsyncStorage.removeItem(CHAVE_TOKEN).catch(() => {});
}

export function obterEmailUsuario(): string | null {
  return emailUsuario;
}

export function salvarEmailUsuario(valor: string, persistir: boolean): void {
  if (persistir) {
    emailUsuario = valor;
    AsyncStorage.setItem(CHAVE_EMAIL, valor).catch(() => {});
  } else {
    emailUsuario = null;
    AsyncStorage.removeItem(CHAVE_EMAIL).catch(() => {});
  }
}

export function limparEmailUsuario(): void {
  emailUsuario = null;
  AsyncStorage.removeItem(CHAVE_EMAIL).catch(() => {});
}

export function obterNomeUsuario(): string | null {
  return nomeUsuario;
}

export function salvarNomeUsuario(valor: string, persistir: boolean): void {
  if (persistir) {
    nomeUsuario = valor;
    AsyncStorage.setItem(CHAVE_NOME, valor).catch(() => {});
  } else {
    nomeUsuario = null;
    AsyncStorage.removeItem(CHAVE_NOME).catch(() => {});
  }
}

export function limparNomeUsuario(): void {
  nomeUsuario = null;
  AsyncStorage.removeItem(CHAVE_NOME).catch(() => {});
}

export function obterSenha(): string | null {
  return senhaUsuario;
}

export function salvarSenha(valor: string, persistir: boolean): void {
  if (persistir) {
    senhaUsuario = valor;
    AsyncStorage.setItem(CHAVE_SENHA, valor).catch(() => {});
  } else {
    senhaUsuario = null;
    AsyncStorage.removeItem(CHAVE_SENHA).catch(() => {});
  }
}

export function limparSenha(): void {
  senhaUsuario = null;
  AsyncStorage.removeItem(CHAVE_SENHA).catch(() => {});
}

export function obterLembrar(): boolean {
  return lembrarUsuario;
}

export function salvarLembrar(persistir: boolean): void {
  lembrarUsuario = persistir;
  if (persistir) AsyncStorage.setItem(CHAVE_LEMBRAR, "true").catch(() => {});
  else AsyncStorage.removeItem(CHAVE_LEMBRAR).catch(() => {});
}

export function limparLembrar(): void {
  lembrarUsuario = false;
  AsyncStorage.removeItem(CHAVE_LEMBRAR).catch(() => {});
}

export async function hidratar(): Promise<void> {
  const [tokenSalvo, emailSalvo, nomeSalvo, senhaSalva, lembrarSalvo] = await Promise.all([
    AsyncStorage.getItem(CHAVE_TOKEN),
    AsyncStorage.getItem(CHAVE_EMAIL),
    AsyncStorage.getItem(CHAVE_NOME),
    AsyncStorage.getItem(CHAVE_SENHA),
    AsyncStorage.getItem(CHAVE_LEMBRAR),
  ]);
  token = tokenSalvo;
  emailUsuario = emailSalvo;
  nomeUsuario = nomeSalvo;
  senhaUsuario = senhaSalva;
  lembrarUsuario = lembrarSalvo === "true";
}
