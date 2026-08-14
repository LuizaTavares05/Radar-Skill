-- ============================================================
-- Radar Skill - SistemaSkill
-- Criação do schema: usuarios, skills, usuario_skills
-- Script idempotente: pode ser executado mais de uma vez.
-- ============================================================

-- ------------------------------------------------------------
-- Sequences
-- ------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS usuario_id_seq
    START WITH 1
    INCREMENT BY 1;

CREATE SEQUENCE IF NOT EXISTS skill_id_seq
    START WITH 1
    INCREMENT BY 1;

CREATE SEQUENCE IF NOT EXISTS usuario_skill_id_seq
    START WITH 1
    INCREMENT BY 1;

-- ------------------------------------------------------------
-- Tabela usuarios
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
    id         BIGINT       NOT NULL DEFAULT nextval('usuario_id_seq'),
    nome       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    senha      VARCHAR(255) NOT NULL,
    CONSTRAINT pk_usuarios PRIMARY KEY (id),
    CONSTRAINT uk_usuarios_email UNIQUE (email)
);

-- ------------------------------------------------------------
-- Tabela skills
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
    id          BIGINT        NOT NULL DEFAULT nextval('skill_id_seq'),
    nome        VARCHAR(255)  NOT NULL,
    imagem_url  VARCHAR(500),
    descricao   VARCHAR(1000),
    categoria   VARCHAR(50),
    CONSTRAINT pk_skills PRIMARY KEY (id),
    CONSTRAINT uk_skills_nome UNIQUE (nome)
);

-- ------------------------------------------------------------
-- Tabela usuario_skills (associação usuário <-> skill + nível)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario_skills (
    id          BIGINT       NOT NULL DEFAULT nextval('usuario_skill_id_seq'),
    usuario_id  BIGINT       NOT NULL,
    skill_id    BIGINT       NOT NULL,
    nivel       VARCHAR(20)  NOT NULL,
    descricao   VARCHAR(1000),
    CONSTRAINT pk_usuario_skills PRIMARY KEY (id),
    CONSTRAINT fk_usuario_skills_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
    CONSTRAINT fk_usuario_skills_skill FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE,
    CONSTRAINT uk_usuario_skills_usuario_skill UNIQUE (usuario_id, skill_id),
    CONSTRAINT ck_usuario_skills_nivel CHECK (nivel IN ('INICIANTE', 'INTERMEDIARIO', 'AVANCADO'))
);

