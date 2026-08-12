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
@Schema(description = "Dados para associar uma skill ao usuário")
public class AdicionarSkillRequest {

    @Schema(description = "ID da skill do catálogo", example = "1")
    @NotNull(message = "O id da skill é obrigatório.")
    private Long skillId;

    @Schema(description = "Nível de proficiência", example = "AVANCADO")
    @NotNull(message = "O nível é obrigatório.")
    private Level nivel;

    @Schema(description = "Descrição escrita pelo usuário sobre sua experiência com a skill", example = "Uso há 3 anos em microsserviços")
    @Size(max = 1000, message = "A descrição deve ter no máximo 1000 caracteres.")
    private String descricao;
}
