package com.desafio.neki.dto.response;

import com.desafio.neki.entity.Skill;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Skill do catálogo disponível para seleção")
public record CatalogoSkillResponse(
        @Schema(description = "ID da skill", example = "1")
        Long id,
        @Schema(description = "Nome da skill", example = "Java")
        String nome,
        @Schema(description = "URL da imagem da skill", example = "https://cdn.example.com/java.svg")
        String imagemUrl,
        @Schema(description = "Descrição da skill", example = "Linguagem de programação orientada a objetos")
        String descricao,
        @Schema(description = "Categoria da skill", example = "Backend")
        String categoria) {

    public static CatalogoSkillResponse from(Skill skill) {
        return new CatalogoSkillResponse(
                skill.getId(),
                skill.getNome(),
                skill.getImagemUrl(),
                skill.getDescricao(),
                skill.getCategoria());
    }
}
