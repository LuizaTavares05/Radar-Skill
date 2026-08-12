package com.desafio.neki.security;

import com.desafio.neki.entity.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Adapta a entidade {@link Usuario} à interface {@link UserDetails}
 * exigida pelo Spring Security, mantendo a entidade desacoplada da segurança.
 */
public class PrincipalUsuario implements UserDetails {

    private final Usuario usuario;

    public PrincipalUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public Long getId() {
        return usuario.getId();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getPassword() {
        return usuario.getSenha();
    }

    @Override
    public String getUsername() {
        return usuario.getEmail();
    }
}
