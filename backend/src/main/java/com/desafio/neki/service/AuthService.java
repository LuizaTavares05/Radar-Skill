package com.desafio.neki.service;

import com.desafio.neki.dto.request.CadastroRequest;
import com.desafio.neki.dto.request.LoginRequest;
import com.desafio.neki.dto.response.LoginResponse;
import com.desafio.neki.dto.response.MensagemResponse;
import com.desafio.neki.entity.Usuario;
import com.desafio.neki.exception.BusinessException;
import com.desafio.neki.repository.UsuarioRepository;
import com.desafio.neki.security.JwtService;
import com.desafio.neki.security.PrincipalUsuario;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public MensagemResponse register(CadastroRequest request) {
        if (!request.getSenha().equals(request.getConfirmacaoSenha())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "As senhas não coincidem.");
        }

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(HttpStatus.CONFLICT, "O email já está em uso.");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.getNome())
                .email(request.getEmail())
                .senha(passwordEncoder.encode(request.getSenha()))
                .build();

        usuarioRepository.save(usuario);
        return new MensagemResponse("Usuário cadastrado com sucesso.");
    }

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getSenha()));
        Usuario usuario = ((PrincipalUsuario) authentication.getPrincipal()).getUsuario();
        return new LoginResponse(jwtService.generateToken(request.getEmail()), usuario.getNome());
    }
}
