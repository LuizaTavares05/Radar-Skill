package com.desafio.neki.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Resposta simples contendo uma mensagem")
public record MensagemResponse(
        @Schema(description = "Mensagem informativa", example = "Usuário cadastrado com sucesso.")
        String mensagem) {
}
