package com.desafio.neki.controller;

import com.desafio.neki.dto.request.AdicionarSkillRequest;
import com.desafio.neki.dto.request.AtualizarSkillRequest;
import com.desafio.neki.dto.response.CatalogoSkillResponse;
import com.desafio.neki.dto.response.SkillResponse;
import com.desafio.neki.security.PrincipalUsuario;
import com.desafio.neki.service.SkillService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
@Tag(name = "Skills", description = "Skills associadas ao usuário e catálogo de skills")
@SecurityRequirement(name = "bearerAuth")
public class SkillController {

    private final SkillService skillService;

    @GetMapping
    @Operation(summary = "Listar minhas skills",
            description = "Retorna as skills associadas ao usuário autenticado (identificado pelo JWT).")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Skills do usuário",
                    content = @Content(schema = @Schema(implementation = SkillResponse.class))),
            @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    public ResponseEntity<List<SkillResponse>> listarSkills(
            @AuthenticationPrincipal PrincipalUsuario principal) {
        return ResponseEntity.ok(skillService.listarSkillsDoUsuario(principal.getUsuario()));
    }

    @GetMapping("/catalogo")
    @Operation(summary = "Catálogo de skills",
            description = "Retorna todas as skills disponíveis para seleção no frontend.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Catálogo de skills",
                    content = @Content(schema = @Schema(implementation = CatalogoSkillResponse.class)))
    })
    public ResponseEntity<List<CatalogoSkillResponse>> listarCatalogo() {
        return ResponseEntity.ok(skillService.listarCatalogo());
    }

    @PostMapping
    @Operation(summary = "Associar skill",
            description = "Associa uma skill do catálogo ao usuário autenticado com um nível e uma descrição.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Skill associada com sucesso",
                    content = @Content(schema = @Schema(implementation = SkillResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou nível inválido"),
            @ApiResponse(responseCode = "404", description = "Skill não encontrada"),
            @ApiResponse(responseCode = "409", description = "Skill já associada ao usuário")
    })
    public ResponseEntity<SkillResponse> adicionarSkill(
            @AuthenticationPrincipal PrincipalUsuario principal,
            @Valid @RequestBody AdicionarSkillRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(skillService.adicionarSkill(principal.getUsuario(), request));
    }

    @PatchMapping("/{idAssociacao}")
    @Operation(summary = "Atualizar nível e descrição da skill",
            description = "Atualiza o nível e a descrição da associação do usuário autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Nível atualizado",
                    content = @Content(schema = @Schema(implementation = SkillResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "403", description = "Associação de outro usuário"),
            @ApiResponse(responseCode = "404", description = "Associação não encontrada")
    })
    public ResponseEntity<SkillResponse> atualizarLevel(
            @AuthenticationPrincipal PrincipalUsuario principal,
            @PathVariable Long idAssociacao,
            @Valid @RequestBody AtualizarSkillRequest request) {
        return ResponseEntity.ok(skillService.atualizarLevel(principal.getUsuario(), idAssociacao, request));
    }

    @DeleteMapping("/{idAssociacao}")
    @Operation(summary = "Excluir skill associada",
            description = "Remove a associação do usuário autenticado.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Associação excluída"),
            @ApiResponse(responseCode = "403", description = "Associação de outro usuário"),
            @ApiResponse(responseCode = "404", description = "Associação não encontrada")
    })
    public ResponseEntity<Void> excluirSkill(
            @AuthenticationPrincipal PrincipalUsuario principal,
            @PathVariable Long idAssociacao) {
        skillService.excluirSkill(principal.getUsuario(), idAssociacao);
        return ResponseEntity.noContent().build();
    }
}
