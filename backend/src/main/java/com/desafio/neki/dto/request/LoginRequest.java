package com.desafio.neki.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
@Schema(description = "Dados de login")
public class LoginRequest {

    @Schema(description = "Email do usuário", example = "joao.silva@example.com")
    @NotBlank(message = "O email é obrigatório.")
    @Email(message = "O email deve ser um endereço válido.")
    @Size(max = 255, message = "O email deve ter no máximo 255 caracteres.")
    private String email;

    @Schema(description = "Senha do usuário", example = "senha123")
    @NotBlank(message = "A senha é obrigatória.")
    private String senha;
}
