package com.desafio.neki.service;

import com.desafio.neki.dto.request.CadastroRequest;
import com.desafio.neki.dto.request.LoginRequest;
import com.desafio.neki.dto.response.LoginResponse;
import com.desafio.neki.entity.Usuario;
import com.desafio.neki.exception.BusinessException;
import com.desafio.neki.repository.UsuarioRepository;
import com.desafio.neki.security.CustomUserDetailsService;
import com.desafio.neki.security.JwtAuthenticationFilter;
import com.desafio.neki.security.JwtService;
import com.desafio.neki.security.PrincipalUsuario;
import com.desafio.neki.service.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthFeatureTesteUnitario {

    @Nested
    @DisplayName("AuthService")
    class AuthServiceTest {

        @Mock
        private UsuarioRepository usuarioRepository;
        @Mock
        private PasswordEncoder passwordEncoder;
        @Mock
        private AuthenticationManager authenticationManager;
        @Mock
        private JwtService jwtService;
        @Mock
        private Authentication authentication;

        private AuthService authService;

        @BeforeEach
        void setUp() {
            authService = new AuthService(usuarioRepository, passwordEncoder, authenticationManager, jwtService);
        }

        @Test
        @DisplayName("Cadastro deve criptografar a senha com BCrypt e persistir")
        void cadastroDeveCriptografarSenhaEPersistir() {
            CadastroRequest request = CadastroRequest.builder()
                    .nome("João Silva")
                    .email("joao.silva@example.com")
                    .senha("senha123")
                    .confirmacaoSenha("senha123")
                    .build();
            when(usuarioRepository.existsByEmail("joao.silva@example.com")).thenReturn(false);
            when(passwordEncoder.encode("senha123")).thenReturn("$2a$10$hashsimulado");

            authService.register(request);

            ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);
            verify(usuarioRepository).save(captor.capture());
            assertEquals("João Silva", captor.getValue().getNome());
            assertEquals("joao.silva@example.com", captor.getValue().getEmail());
            assertEquals("$2a$10$hashsimulado", captor.getValue().getSenha());
            assertNotEquals("senha123", captor.getValue().getSenha());
        }

        @Test
        @DisplayName("Cadastro com email repetido deve lançar 409")
        void cadastroComEmailRepetidoDeveLancar409() {
            CadastroRequest request = CadastroRequest.builder()
                    .nome("João Silva")
                    .email("joao.silva@example.com")
                    .senha("senha123")
                    .confirmacaoSenha("senha123")
                    .build();
            when(usuarioRepository.existsByEmail("joao.silva@example.com")).thenReturn(true);

            BusinessException ex = assertThrows(BusinessException.class, () -> authService.register(request));

            assertEquals(HttpStatus.CONFLICT, ex.getStatus());
            assertEquals("O email já está em uso.", ex.getMessage());
        }

        @Test
        @DisplayName("Cadastro com senhas diferentes deve lançar 400")
        void cadastroComSenhasDiferentesDeveLancar400() {
            CadastroRequest request = CadastroRequest.builder()
                    .nome("João Silva")
                    .email("joao.silva@example.com")
                    .senha("senha123")
                    .confirmacaoSenha("outraSenha")
                    .build();

            BusinessException ex = assertThrows(BusinessException.class, () -> authService.register(request));

            assertEquals(HttpStatus.BAD_REQUEST, ex.getStatus());
            assertEquals("As senhas não coincidem.", ex.getMessage());
            verify(usuarioRepository, never()).save(any());
        }

        @Test
        @DisplayName("Login deve autenticar e retornar token e nome")
        void loginDeveAutenticarERetornarTokenENome() {
            Usuario usuario = Usuario.builder()
                    .id(1L)
                    .nome("João Silva")
                    .email("joao.silva@example.com")
                    .senha("$2a$10$hash")
                    .build();
            LoginRequest request = LoginRequest.builder()
                    .email("joao.silva@example.com")
                    .senha("senha123")
                    .build();
            when(jwtService.generateToken("joao.silva@example.com")).thenReturn("token-jwt");
            when(authenticationManager.authenticate(any())).thenReturn(authentication);
            when(authentication.getPrincipal()).thenReturn(new PrincipalUsuario(usuario));

            LoginResponse response = authService.login(request);

            assertEquals("token-jwt", response.token());
            assertEquals("João Silva", response.nome());
            verify(authenticationManager).authenticate(any());
        }
    }

    @Nested
    @DisplayName("JwtService")
    class JwtServiceTest {

        private static final String SECRET = "talentario-test-secret-jwt-hs256-2026-32bytes";

        private JwtService jwtService;

        @BeforeEach
        void setUp() {
            jwtService = new JwtService(SECRET, 3600000L);
        }

        @Test
        @DisplayName("Deve gerar token e extrair o login")
        void deveGerarTokenEExtrairLogin() {
            String token = jwtService.generateToken("joao.silva@example.com");

            assertEquals("joao.silva@example.com", jwtService.extractUsername(token));
            assertTrue(jwtService.isValid(token, "joao.silva@example.com"));
        }

        @Test
        @DisplayName("Token gerado para outro usuário deve ser inválido")
        void deveRejeitarTokenDeOutroUsuario() {
            String token = jwtService.generateToken("joao.silva@example.com");

            assertFalse(jwtService.isValid(token, "maria.oliveira@example.com"));
        }

        @Test
        @DisplayName("Token com assinatura adulterada deve ser inválido")
        void deveRejeitarTokenAdulterado() {
            String token = jwtService.generateToken("joao.silva@example.com");
            String tampered = token.substring(0, token.length() - 4) + "XXXX";

            assertFalse(jwtService.isValid(tampered, "joao.silva@example.com"));
        }

        @Test
        @DisplayName("Token expirado deve ser inválido")
        void deveRejeitarTokenExpirado() {
            JwtService expirado = new JwtService(SECRET, -1000L);
            String token = expirado.generateToken("joao.silva@example.com");

            assertFalse(jwtService.isValid(token, "joao.silva@example.com"));
        }
    }

    @Nested
    @DisplayName("JwtAuthenticationFilter")
    class JwtAuthenticationFilterTest {

        @Mock
        private JwtService jwtService;
        @Mock
        private CustomUserDetailsService userDetailsService;
        @Mock
        private HttpServletRequest request;
        @Mock
        private HttpServletResponse response;
        @Mock
        private FilterChain filterChain;

        private JwtAuthenticationFilter filter;

        @BeforeEach
        void setUp() {
            filter = new JwtAuthenticationFilter(jwtService, userDetailsService);
        }

        @AfterEach
        void limparContexto() {
            SecurityContextHolder.clearContext();
        }

        @Test
        @DisplayName("Token válido deve autenticar a requisição")
        void tokenValidoDeveAutenticar() throws Exception {
            when(request.getHeader("Authorization")).thenReturn("Bearer token-123");
            when(jwtService.extractUsername("token-123")).thenReturn("joao.silva@example.com");
            UserDetails userDetails = new PrincipalUsuario(Usuario.builder()
                    .id(1L)
                    .nome("João Silva")
                    .email("joao.silva@example.com")
                    .senha("$2a$10$hash")
                    .build());
            when(userDetailsService.loadUserByUsername("joao.silva@example.com")).thenReturn(userDetails);
            when(jwtService.isValid("token-123", "joao.silva@example.com")).thenReturn(true);

            filter.doFilter(request, response, filterChain);

            var authentication = SecurityContextHolder.getContext().getAuthentication();
            assertNotNull(authentication);
            assertInstanceOf(UsernamePasswordAuthenticationToken.class, authentication);
            assertEquals("joao.silva@example.com", authentication.getName());
            verify(filterChain).doFilter(request, response);
        }

        @Test
        @DisplayName("Requisição sem token deve seguir sem autenticar")
        void semTokenDeveSeguirSemAutenticar() throws Exception {
            when(request.getHeader("Authorization")).thenReturn(null);

            filter.doFilter(request, response, filterChain);

            assertNull(SecurityContextHolder.getContext().getAuthentication());
            verify(filterChain).doFilter(request, response);
        }

        @Test
        @DisplayName("Token inválido deve limpar o contexto e seguir")
        void tokenInvalidoNaoDeveAutenticar() throws Exception {
            when(request.getHeader("Authorization")).thenReturn("Bearer token-123");
            when(jwtService.extractUsername("token-123")).thenThrow(new RuntimeException("token inválido"));

            filter.doFilter(request, response, filterChain);

            assertNull(SecurityContextHolder.getContext().getAuthentication());
            verify(filterChain).doFilter(request, response);
        }
    }
}
