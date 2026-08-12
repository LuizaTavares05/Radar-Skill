package com.desafio.neki.dto.request;

import com.desafio.neki.entity.Level;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Dados para atualizar o nível de uma skill associada")
public class AtualizarSkillRequest {

    @Schema(description = "Novo nível de proficiência", example = "INTERMEDIARIO")
    @NotNull(message = "O nível é obrigatório.")
    private Level nivel;

    @Schema(description = "Nova descrição escrita pelo usuário sobre a skill", example = "Uso há 3 anos em microsserviços")
    @Size(max = 1000, message = "A descrição deve ter no máximo 1000 caracteres.")
    private String descricao;
}
