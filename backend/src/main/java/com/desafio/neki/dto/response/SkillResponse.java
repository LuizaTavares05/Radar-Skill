package com.desafio.neki.dto.response;

import com.desafio.neki.entity.Level;
import com.desafio.neki.entity.UsuarioSkill;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Skill associada ao usuário, com o nível e a descrição escritos por ele")
public record SkillResponse(
        @Schema(description = "ID da associação (UserSkill) - usar nos endpoints de atualizar/excluir", example = "1")
        Long id,
        @Schema(description = "Nome da skill", example = "Java")
        String nome,
        @Schema(description = "URL da imagem da skill", example = "https://cdn.example.com/java.svg")
        String imagemUrl,
        @Schema(description = "Descrição escrita pelo usuário sobre a skill", example = "Uso há 3 anos em microsserviços")
        String descricao,
        @Schema(description = "Descrição da skill do catálogo", example = "Linguagem de programação orientada a objetos")
        String descricaoSkill,
        @Schema(description = "Categoria da skill", example = "Backend")
        String categoria,
        @Schema(description = "Nível de proficiência do usuário", example = "AVANCADO")
        Level nivel) {

    public static SkillResponse from(UsuarioSkill usuarioSkill) {
        return new SkillResponse(
                usuarioSkill.getId(),
                usuarioSkill.getSkill().getNome(),
                usuarioSkill.getSkill().getImagemUrl(),
                usuarioSkill.getDescricao(),
                usuarioSkill.getSkill().getDescricao(),
                usuarioSkill.getSkill().getCategoria(),
                usuarioSkill.getNivel());
    }
}
