package com.desafio.neki.service;

import com.desafio.neki.dto.request.AdicionarSkillRequest;
import com.desafio.neki.dto.request.AtualizarSkillRequest;
import com.desafio.neki.dto.response.CatalogoSkillResponse;
import com.desafio.neki.dto.response.SkillResponse;
import com.desafio.neki.entity.Level;
import com.desafio.neki.entity.Skill;
import com.desafio.neki.entity.Usuario;
import com.desafio.neki.entity.UsuarioSkill;
import com.desafio.neki.exception.BusinessException;
import com.desafio.neki.exception.ResourceNotFoundException;
import com.desafio.neki.repository.SkillRepository;
import com.desafio.neki.repository.UsuarioSkillRepository;
import com.desafio.neki.service.SkillService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SkillFeatureTesteUnitario {

    @Nested
    @DisplayName("SkillService")
    class SkillServiceTest {

        @Mock
        private SkillRepository skillRepository;
        @Mock
        private UsuarioSkillRepository usuarioSkillRepository;

        private SkillService skillService;
        private Usuario usuario;
        private Skill skill;

        @BeforeEach
        void setUp() {
            skillService = new SkillService(skillRepository, usuarioSkillRepository);
            usuario = Usuario.builder().id(1L).email("joao.silva@example.com").senha("$2a$10$hash").build();
            skill = Skill.builder().id(10L).nome("Java").descricao("Linguagem de programação").build();
        }

        @Test
        @DisplayName("Associar skill deve persistir e retornar resposta")
        void adicionarSkillComSucesso() {
            when(skillRepository.findById(10L)).thenReturn(Optional.of(skill));
            when(usuarioSkillRepository.existsByUsuarioIdAndSkillId(1L, 10L)).thenReturn(false);
            when(usuarioSkillRepository.save(any(UsuarioSkill.class))).thenAnswer(invocation -> {
                UsuarioSkill us = invocation.getArgument(0);
                us.setId(99L);
                return us;
            });

            AdicionarSkillRequest request = AdicionarSkillRequest.builder()
                    .skillId(10L)
                    .nivel(Level.AVANCADO)
                    .descricao("Uso há 3 anos em microsserviços")
                    .build();

            SkillResponse response = skillService.adicionarSkill(usuario, request);

            assertEquals("Java", response.nome());
            assertEquals(Level.AVANCADO, response.nivel());
            assertEquals("Uso há 3 anos em microsserviços", response.descricao());
            assertEquals("Linguagem de programação", response.descricaoSkill());
            verify(usuarioSkillRepository).save(any(UsuarioSkill.class));
        }

        @Test
        @DisplayName("Associar skill inexistente deve lançar 404")
        void adicionarSkillInexistente() {
            when(skillRepository.findById(999L)).thenReturn(Optional.empty());

            AdicionarSkillRequest request = AdicionarSkillRequest.builder()
                    .skillId(999L)
                    .nivel(Level.INICIANTE)
                    .build();

            assertThrows(ResourceNotFoundException.class, () -> skillService.adicionarSkill(usuario, request));
            verify(usuarioSkillRepository, never()).save(any());
        }

        @Test
        @DisplayName("Associar skill repetida deve lançar 409")
        void adicionarSkillRepetida() {
            when(skillRepository.findById(10L)).thenReturn(Optional.of(skill));
            when(usuarioSkillRepository.existsByUsuarioIdAndSkillId(1L, 10L)).thenReturn(true);

            AdicionarSkillRequest request = AdicionarSkillRequest.builder()
                    .skillId(10L)
                    .nivel(Level.INICIANTE)
                    .build();

            BusinessException ex = assertThrows(BusinessException.class,
                    () -> skillService.adicionarSkill(usuario, request));

            assertEquals(HttpStatus.CONFLICT, ex.getStatus());
            assertEquals("A skill já está associada ao usuário.", ex.getMessage());
        }

        @Test
        @DisplayName("Atualizar nível e descrição deve alterar ambos")
        void atualizarLevelComSucesso() {
            UsuarioSkill associacao = UsuarioSkill.builder()
                    .id(5L)
                    .usuario(usuario)
                    .skill(skill)
                    .nivel(Level.INICIANTE)
                    .descricao("Descrição antiga")
                    .build();
            when(usuarioSkillRepository.findById(5L)).thenReturn(Optional.of(associacao));
            when(usuarioSkillRepository.save(any(UsuarioSkill.class))).thenReturn(associacao);

            AtualizarSkillRequest request = AtualizarSkillRequest.builder()
                    .nivel(Level.INTERMEDIARIO)
                    .descricao("Descrição nova")
                    .build();

            SkillResponse response = skillService.atualizarLevel(usuario, 5L, request);

            assertEquals(Level.INTERMEDIARIO, response.nivel());
            assertEquals("Descrição nova", response.descricao());
        }

        @Test
        @DisplayName("Atualizar associação de outro usuário deve lançar 403")
        void atualizarLevelDeOutroUsuario() {
            Usuario outro = Usuario.builder().id(2L).email("maria.oliveira@example.com").build();
            UsuarioSkill associacao = UsuarioSkill.builder()
                    .id(5L)
                    .usuario(outro)
                    .skill(skill)
                    .nivel(Level.INICIANTE)
                    .build();
            when(usuarioSkillRepository.findById(5L)).thenReturn(Optional.of(associacao));

            AtualizarSkillRequest request = AtualizarSkillRequest.builder()
                    .nivel(Level.AVANCADO)
                    .build();

            BusinessException ex = assertThrows(BusinessException.class,
                    () -> skillService.atualizarLevel(usuario, 5L, request));

            assertEquals(HttpStatus.FORBIDDEN, ex.getStatus());
            verify(usuarioSkillRepository, never()).save(any());
        }

        @Test
        @DisplayName("Atualizar associação inexistente deve lançar 404")
        void atualizarLevelInexistente() {
            when(usuarioSkillRepository.findById(999L)).thenReturn(Optional.empty());

            AtualizarSkillRequest request = AtualizarSkillRequest.builder()
                    .nivel(Level.AVANCADO)
                    .build();

            assertThrows(ResourceNotFoundException.class,
                    () -> skillService.atualizarLevel(usuario, 999L, request));
        }

        @Test
        @DisplayName("Excluir associação própria deve remover")
        void excluirSkillComSucesso() {
            UsuarioSkill associacao = UsuarioSkill.builder()
                    .id(5L)
                    .usuario(usuario)
                    .skill(skill)
                    .nivel(Level.INICIANTE)
                    .build();
            when(usuarioSkillRepository.findById(5L)).thenReturn(Optional.of(associacao));

            skillService.excluirSkill(usuario, 5L);

            verify(usuarioSkillRepository).delete(associacao);
        }

        @Test
        @DisplayName("Excluir associação de outro usuário deve lançar 403")
        void excluirSkillDeOutroUsuario() {
            Usuario outro = Usuario.builder().id(2L).email("maria.oliveira@example.com").build();
            UsuarioSkill associacao = UsuarioSkill.builder()
                    .id(5L)
                    .usuario(outro)
                    .skill(skill)
                    .nivel(Level.INICIANTE)
                    .build();
            when(usuarioSkillRepository.findById(5L)).thenReturn(Optional.of(associacao));

            BusinessException ex = assertThrows(BusinessException.class,
                    () -> skillService.excluirSkill(usuario, 5L));

            assertEquals(HttpStatus.FORBIDDEN, ex.getStatus());
            verify(usuarioSkillRepository, never()).delete(any());
        }

        @Test
        @DisplayName("Listar skills deve retornar somente as do usuário")
        void listarSkillsDoUsuario() {
            UsuarioSkill associacao = UsuarioSkill.builder()
                    .id(5L)
                    .usuario(usuario)
                    .skill(skill)
                    .nivel(Level.INTERMEDIARIO)
                    .build();
            when(usuarioSkillRepository.findByUsuarioIdOrderByIdAsc(1L)).thenReturn(List.of(associacao));

            List<SkillResponse> responses = skillService.listarSkillsDoUsuario(usuario);

            assertEquals(1, responses.size());
            assertEquals("Java", responses.get(0).nome());
        }
    }

    @Nested
    @DisplayName("SkillResponse e CatalogoSkillResponse")
    class SkillResponseTest {

        @Test
        @DisplayName("from deve mapear descrição do usuário e do catálogo")
        void fromDeveMapearDescricaoDoUsuarioEDoCatalogo() {
            Skill skill = Skill.builder()
                    .id(10L)
                    .nome("Java")
                    .imagemUrl("https://cdn.example.com/java.svg")
                    .descricao("Descrição do catálogo")
                    .categoria("Backend")
                    .build();
            Usuario usuario = Usuario.builder().id(1L).email("joao.silva@example.com").build();
            UsuarioSkill associacao = UsuarioSkill.builder()
                    .id(5L)
                    .usuario(usuario)
                    .skill(skill)
                    .nivel(Level.AVANCADO)
                    .descricao("Descrição do usuário")
                    .build();

            SkillResponse response = SkillResponse.from(associacao);

            assertEquals(5L, response.id());
            assertEquals("Java", response.nome());
            assertEquals("Descrição do usuário", response.descricao());
            assertEquals("Descrição do catálogo", response.descricaoSkill());
            assertEquals("Backend", response.categoria());
            assertEquals(Level.AVANCADO, response.nivel());
        }

        @Test
        @DisplayName("CatalogoSkillResponse.from deve mapear skill do catálogo")
        void catalogoFromDeveMapearSkill() {
            Skill skill = Skill.builder()
                    .id(10L)
                    .nome("Java")
                    .imagemUrl("https://cdn.example.com/java.svg")
                    .descricao("Descrição do catálogo")
                    .categoria("Backend")
                    .build();

            CatalogoSkillResponse response = CatalogoSkillResponse.from(skill);

            assertEquals(10L, response.id());
            assertEquals("Java", response.nome());
            assertEquals("Descrição do catálogo", response.descricao());
            assertEquals("Backend", response.categoria());
        }
    }
}
