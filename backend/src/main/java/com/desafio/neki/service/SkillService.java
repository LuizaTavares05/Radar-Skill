package com.desafio.neki.service;

import com.desafio.neki.dto.request.AdicionarSkillRequest;
import com.desafio.neki.dto.request.AtualizarSkillRequest;
import com.desafio.neki.dto.response.CatalogoSkillResponse;
import com.desafio.neki.dto.response.SkillResponse;
import com.desafio.neki.entity.Skill;
import com.desafio.neki.entity.Usuario;
import com.desafio.neki.entity.UsuarioSkill;
import com.desafio.neki.exception.BusinessException;
import com.desafio.neki.exception.ResourceNotFoundException;
import com.desafio.neki.repository.SkillRepository;
import com.desafio.neki.repository.UsuarioSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;
    private final UsuarioSkillRepository usuarioSkillRepository;

    @Transactional(readOnly = true)
    public List<SkillResponse> listarSkillsDoUsuario(Usuario usuario) {
        return usuarioSkillRepository.findByUsuarioIdOrderByIdAsc(usuario.getId()).stream()
                .map(SkillResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CatalogoSkillResponse> listarCatalogo() {
        return skillRepository.findAll().stream()
                .map(CatalogoSkillResponse::from)
                .toList();
    }

    @Transactional
    public SkillResponse adicionarSkill(Usuario usuario, AdicionarSkillRequest request) {
        Skill skill = skillRepository.findById(request.getSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill não encontrada."));

        if (usuarioSkillRepository.existsByUsuarioIdAndSkillId(usuario.getId(), skill.getId())) {
            throw new BusinessException(HttpStatus.CONFLICT, "A skill já está associada ao usuário.");
        }

        UsuarioSkill usuarioSkill = UsuarioSkill.builder()
                .usuario(usuario)
                .skill(skill)
                .nivel(request.getNivel())
                .descricao(request.getDescricao())
                .build();

        return SkillResponse.from(usuarioSkillRepository.save(usuarioSkill));
    }

    @Transactional
    public SkillResponse atualizarLevel(Usuario usuario, Long associationId, AtualizarSkillRequest request) {
        UsuarioSkill usuarioSkill = buscarAssociacaoDoUsuario(usuario, associationId);
        usuarioSkill.setNivel(request.getNivel());
        usuarioSkill.setDescricao(request.getDescricao());
        return SkillResponse.from(usuarioSkillRepository.save(usuarioSkill));
    }

    @Transactional
    public void excluirSkill(Usuario usuario, Long associationId) {
        UsuarioSkill usuarioSkill = buscarAssociacaoDoUsuario(usuario, associationId);
        usuarioSkillRepository.delete(usuarioSkill);
    }

    private UsuarioSkill buscarAssociacaoDoUsuario(Usuario usuario, Long associationId) {
        UsuarioSkill usuarioSkill = usuarioSkillRepository.findById(associationId)
                .orElseThrow(() -> new ResourceNotFoundException("Associação não encontrada."));

        if (!usuarioSkill.getUsuario().getId().equals(usuario.getId())) {
            throw new BusinessException(HttpStatus.FORBIDDEN, "A associação não pertence ao usuário autenticado.");
        }
        return usuarioSkill;
    }
}
