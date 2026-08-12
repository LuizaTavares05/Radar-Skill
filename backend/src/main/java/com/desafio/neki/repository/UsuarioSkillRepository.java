package com.desafio.neki.repository;

import com.desafio.neki.entity.UsuarioSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioSkillRepository extends JpaRepository<UsuarioSkill, Long> {

    boolean existsByUsuarioIdAndSkillId(Long usuarioId, Long skillId);

    Optional<UsuarioSkill> findByIdAndUsuarioId(Long id, Long usuarioId);

    List<UsuarioSkill> findByUsuarioIdOrderByIdAsc(Long usuarioId);
}
