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
@Schema(description = "Dados para cadastro de um novo usuário")
public class CadastroRequest {

    @Schema(description = "Nome completo do usuário", example = "João Silva")
    @NotBlank(message = "O nome é obrigatório.")
    @Size(max = 255, message = "O nome deve ter no máximo 255 caracteres.")
    private String nome;

    @Schema(description = "Email do usuário (único)", example = "joao.silva@example.com")
    @NotBlank(message = "O email é obrigatório.")
    @Email(message = "Digite um e-mail válido")
    @Size(max = 255, message = "O email deve ter no máximo 255 caracteres.")
    private String email;

    @Schema(description = "Senha do usuário", example = "senha123")
    @NotBlank(message = "A senha é obrigatória.")
    @Size(min = 6, max = 255, message = "A senha deve ter entre 6 e 255 caracteres.")
    private String senha;

    @Schema(description = "Confirmação da senha do usuário", example = "senha123")
    @NotBlank(message = "A confirmação de senha é obrigatória.")
    @Size(min = 6, max = 255, message = "A confirmação de senha deve ter entre 6 e 255 caracteres.")
    private String confirmacaoSenha;
}
