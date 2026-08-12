import { apiFetch } from "./client";

export type DadosCadastro = {
  nome: string;
  email: string;
  senha: string;
  confirmacaoSenha: string;
};

export type DadosLogin = {
  email: string;
  senha: string;
};

export type RespostaAutenticacao = {
  token: string;
  nome?: string;
};

export function cadastrar(payload: DadosCadastro): Promise<{ mensagem: string }> {
  return apiFetch("/api/auth/cadastrar", { method: "POST", body: payload });
}

export function entrar(payload: DadosLogin): Promise<RespostaAutenticacao> {
  return apiFetch("/api/auth/login", { method: "POST", body: payload });
}
