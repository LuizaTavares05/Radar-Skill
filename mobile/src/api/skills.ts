import type { Nivel, NivelApi, Skill, SkillCatalogo } from "../types";
import { deNivelApi, paraNivelApi } from "../types";
import { apiFetch } from "./client";

type SkillUsuarioResposta = {
  id: number;
  nome: string;
  descricao: string;
  descricaoSkill: string;
  categoria: string;
  imagemUrl: string;
  nivel: NivelApi;
};

type SkillCatalogoResposta = {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  imagemUrl: string;
};

function paraSkill(data: SkillUsuarioResposta): Skill {
  return {
    id: data.id,
    nome: data.nome,
    categoria: data.categoria,
    imagemUrl: data.imagemUrl ?? "",
    descricao: data.descricao,
    descricaoSkill: data.descricaoSkill,
    nivel: deNivelApi(data.nivel),
  };
}

function paraSkillCatalogo(data: SkillCatalogoResposta): SkillCatalogo {
  return {
    id: data.id,
    nome: data.nome,
    categoria: data.categoria,
    imagemUrl: data.imagemUrl ?? "",
    descricao: data.descricao,
  };
}

export function obterCatalogo(token?: string | null): Promise<SkillCatalogo[]> {
  return apiFetch<SkillCatalogoResposta[]>("/api/skills/catalogo", { token }).then((lista) =>
    lista.map(paraSkillCatalogo),
  );
}

export function obterMinhasSkills(token: string | null): Promise<Skill[]> {
  return apiFetch<SkillUsuarioResposta[]>("/api/skills", { token }).then((lista) =>
    lista.map(paraSkill),
  );
}

export function adicionarSkill(
  skillId: number,
  nivel: Nivel,
  descricao: string,
  token: string | null,
): Promise<Skill> {
  return apiFetch<SkillUsuarioResposta>("/api/skills", {
    method: "POST",
    token,
    body: { skillId, nivel: paraNivelApi(nivel), descricao },
  }).then(paraSkill);
}

export function atualizarSkill(
  idAssociacao: number,
  nivel: Nivel,
  descricao: string,
  token: string | null,
): Promise<Skill> {
  return apiFetch<SkillUsuarioResposta>(`/api/skills/${idAssociacao}`, {
    method: "PATCH",
    token,
    body: { nivel: paraNivelApi(nivel), descricao },
  }).then(paraSkill);
}

export function excluirSkill(idAssociacao: number, token: string | null): Promise<void> {
  return apiFetch<void>(`/api/skills/${idAssociacao}`, { method: "DELETE", token });
}
