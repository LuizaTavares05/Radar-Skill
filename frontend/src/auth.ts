const CHAVE_TOKEN = "radar.token";
const CHAVE_EMAIL = "radar.emailUsuario";
const CHAVE_NOME = "radar.nomeUsuario";
const CHAVE_SENHA = "radar.senha";
const CHAVE_LEMBRAR = "radar.lembrar";

let memoriaToken: string | null = null;
let memoriaEmail: string | null = null;
let memoriaNome: string | null = null;
let memoriaSenha: string | null = null;
let memoriaLembrar = false;

export function obterToken(): string | null {
  return memoriaToken ?? localStorage.getItem(CHAVE_TOKEN);
}

export function obterEmailUsuario(): string | null {
  return memoriaEmail ?? localStorage.getItem(CHAVE_EMAIL);
}

export function obterNomeUsuario(): string | null {
  return memoriaNome ?? localStorage.getItem(CHAVE_NOME);
}

export function salvarToken(valor: string, persistir: boolean): void {
  memoriaToken = valor;
  if (persistir) localStorage.setItem(CHAVE_TOKEN, valor);
  else localStorage.removeItem(CHAVE_TOKEN);
}

export function salvarEmailUsuario(valor: string, persistir: boolean): void {
  if (persistir) {
    memoriaEmail = valor;
    localStorage.setItem(CHAVE_EMAIL, valor);
  } else {
    memoriaEmail = null;
    localStorage.removeItem(CHAVE_EMAIL);
  }
}

export function salvarNomeUsuario(valor: string, persistir: boolean): void {
  if (persistir) {
    memoriaNome = valor;
    localStorage.setItem(CHAVE_NOME, valor);
  } else {
    memoriaNome = null;
    localStorage.removeItem(CHAVE_NOME);
  }
}

export function obterSenha(): string | null {
  return memoriaSenha ?? localStorage.getItem(CHAVE_SENHA);
}

export function salvarSenha(valor: string, persistir: boolean): void {
  if (persistir) {
    memoriaSenha = valor;
    localStorage.setItem(CHAVE_SENHA, valor);
  } else {
    memoriaSenha = null;
    localStorage.removeItem(CHAVE_SENHA);
  }
}

export function limparSenha(): void {
  memoriaSenha = null;
  localStorage.removeItem(CHAVE_SENHA);
}

export function obterLembrar(): boolean {
  return memoriaLembrar;
}

export function salvarLembrar(persistir: boolean): void {
  memoriaLembrar = persistir;
  if (persistir) localStorage.setItem(CHAVE_LEMBRAR, "true");
  else localStorage.removeItem(CHAVE_LEMBRAR);
}

export function limparLembrar(): void {
  memoriaLembrar = false;
  localStorage.removeItem(CHAVE_LEMBRAR);
}

export function restaurar(): boolean {
  memoriaToken = localStorage.getItem(CHAVE_TOKEN);
  memoriaEmail = localStorage.getItem(CHAVE_EMAIL);
  memoriaNome = localStorage.getItem(CHAVE_NOME);
  memoriaSenha = localStorage.getItem(CHAVE_SENHA);
  memoriaLembrar = localStorage.getItem(CHAVE_LEMBRAR) === "true";
  return !!memoriaToken;
}

export function limparToken(): void {
  memoriaToken = null;
  localStorage.removeItem(CHAVE_TOKEN);
}

export function limparEmailUsuario(): void {
  memoriaEmail = null;
  localStorage.removeItem(CHAVE_EMAIL);
}

export function limparNomeUsuario(): void {
  memoriaNome = null;
  localStorage.removeItem(CHAVE_NOME);
}
