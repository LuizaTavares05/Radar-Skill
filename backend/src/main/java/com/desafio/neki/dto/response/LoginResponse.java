package com.desafio.neki.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Resposta de login com o token JWT")
public record LoginResponse(
        @Schema(description = "Token JWT para autenticação nas próximas requisições", example = "eyJhbGciOiJIUzI1NiJ9...")
        String token,
        @Schema(description = "Nome completo do usuário", example = "João Silva")
        String nome) {
}
