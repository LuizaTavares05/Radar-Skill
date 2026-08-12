export type Nivel = "Iniciante" | "Intermediário" | "Avançado";

export type NivelApi = "INICIANTE" | "INTERMEDIARIO" | "AVANCADO";

export type SkillCatalogo = {
  id: number;
  nome: string;
  categoria: string;
  imagemUrl: string;
  descricao: string;
};

export type Skill = {
  id: number;
  nome: string;
  categoria: string;
  imagemUrl: string;
  descricao: string;
  descricaoSkill?: string;
  nivel: Nivel;
};

export type EntradaSkill = {
  skillId?: number;
  nivel: Nivel;
  descricao: string;
};

export type Page = "login" | "register" | "dashboard";

export const NIVEIS: Nivel[] = ["Iniciante", "Intermediário", "Avançado"];

export type FiltroNivel = "Todos" | Nivel;

export function paraNivelApi(nivel: Nivel): NivelApi {
  switch (nivel) {
    case "Iniciante":
      return "INICIANTE";
    case "Intermediário":
      return "INTERMEDIARIO";
    case "Avançado":
      return "AVANCADO";
  }
}

export function deNivelApi(nivel: string): Nivel {
  switch (nivel) {
    case "INICIANTE":
      return "Iniciante";
    case "INTERMEDIARIO":
      return "Intermediário";
    case "AVANCADO":
      return "Avançado";
    default:
      return "Intermediário";
  }
}
