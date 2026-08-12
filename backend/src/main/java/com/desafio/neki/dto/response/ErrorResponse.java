package com.desafio.neki.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;

@Schema(description = "Resposta padronizada de erro")
public record ErrorResponse(
        @Schema(description = "Código de status HTTP", example = "404")
        int status,
        @Schema(description = "Mensagem de erro", example = "Recurso não encontrado.")
        String mensagem,
        @Schema(description = "Momento em que o erro ocorreu", example = "2026-08-08T12:00:00Z")
        Instant timestamp) {
}
