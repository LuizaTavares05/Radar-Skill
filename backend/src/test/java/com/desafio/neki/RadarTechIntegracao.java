package com.desafio.neki;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
@Sql(statements = {
        "DELETE FROM usuario_skills;",
        "DELETE FROM usuarios;"
}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
class RadarTechIntegracao {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("Fluxo completo: cadastro, login, skills e isolamento entre usuários")
    void fluxoCompleto() throws Exception {
        String tokenA = registrarELogar("Usuario A", "usuario.a@test.com", "senha123");
        String tokenB = registrarELogar("Usuario B", "usuario.b@test.com", "senha123");

        long skillId = obterPrimeiraSkillDoCatalogo(tokenA);

        mockMvc.perform(get("/api/skills")
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));

        MvcResult addResult = mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"skillId\":" + skillId + ",\"nivel\":\"AVANCADO\",\"descricao\":\"Minha experiência com Java\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nivel").value("AVANCADO"))
                .andExpect(jsonPath("$.descricao").value("Minha experiência com Java"))
                .andExpect(jsonPath("$.descricaoSkill").exists())
                .andReturn();

        long associationId = objectMapper.readTree(addResult.getResponse().getContentAsString())
                .get("id").asLong();

        mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"skillId\":" + skillId + ",\"nivel\":\"INICIANTE\"}"))
                .andExpect(status().isConflict());

        mockMvc.perform(patch("/api/skills/" + associationId)
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nivel\":\"INTERMEDIARIO\",\"descricao\":\"Minha experiência atualizada\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nivel").value("INTERMEDIARIO"))
                .andExpect(jsonPath("$.descricao").value("Minha experiência atualizada"));

        mockMvc.perform(patch("/api/skills/" + associationId)
                        .header("Authorization", "Bearer " + tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nivel\":\"AVANCADO\"}"))
                .andExpect(status().isForbidden());

        mockMvc.perform(delete("/api/skills/" + associationId)
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isForbidden());

        mockMvc.perform(delete("/api/skills/" + associationId)
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isNoContent());

        mockMvc.perform(delete("/api/skills/" + associationId)
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Cadastro deve retornar 201 e registro repetido deve retornar 409")
    void cadastroELoginRepetido() throws Exception {
        mockMvc.perform(post("/api/auth/cadastrar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Novo Usuário\",\"email\":\"novo.usuario@test.com\",\"senha\":\"senha123\",\"confirmacaoSenha\":\"senha123\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.mensagem").value("Usuário cadastrado com sucesso."));

        mockMvc.perform(post("/api/auth/cadastrar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Novo Usuário\",\"email\":\"novo.usuario@test.com\",\"senha\":\"senha123\",\"confirmacaoSenha\":\"senha123\"}"))
                .andExpect(status().isConflict());

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"novo.usuario@test.com\",\"senha\":\"senha-errada\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Endpoints protegidos exigem token JWT")
    void endpointsExigemAutenticacao() throws Exception {
        mockMvc.perform(get("/api/skills"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/skills/catalogo"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Dados inválidos devem retornar 400")
    void validacaoDeDados() throws Exception {
        mockMvc.perform(post("/api/auth/cadastrar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"\",\"email\":\"\",\"senha\":\"\",\"confirmacaoSenha\":\"\"}"))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/auth/cadastrar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Usuário Válido\",\"email\":\"invalido\",\"senha\":\"senha123\",\"confirmacaoSenha\":\"senha123\"}"))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/auth/cadastrar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Senha Curta\",\"email\":\"curta@test.com\",\"senha\":\"123\",\"confirmacaoSenha\":\"123\"}"))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/auth/cadastrar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"Senhas Divergentes\",\"email\":\"divergente@test.com\",\"senha\":\"senha123\",\"confirmacaoSenha\":\"senha456\"}"))
                .andExpect(status().isBadRequest());

        String token = registrarELogar("Usuário Válida", "usuario.valida@test.com", "senha123");

        mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"skillId\":1}"))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"skillId\":1,\"nivel\":\"INEXISTENTE\"}"))
                .andExpect(status().isBadRequest());
    }

    private String registrarELogar(String nome, String email, String senha) throws Exception {
        mockMvc.perform(post("/api/auth/cadastrar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nome\":\"" + nome + "\",\"email\":\"" + email + "\",\"senha\":\"" + senha + "\",\"confirmacaoSenha\":\"" + senha + "\"}"))
                .andExpect(status().isCreated());

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"senha\":\"" + senha + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value(nome))
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
    }

    private long obterPrimeiraSkillDoCatalogo(String token) throws Exception {
        MvcResult result = mockMvc.perform(get("/api/skills/catalogo")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode catalog = objectMapper.readTree(result.getResponse().getContentAsString());
        assertTrue(catalog.isArray() && catalog.size() > 0, "O catálogo deve possuir skills do seed");
        assertEquals("Java", catalog.get(0).get("nome").asText());
        return catalog.get(0).get("id").asLong();
    }
}
