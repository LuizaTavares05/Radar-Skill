package com.desafio.neki.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Níveis de proficiência de uma skill.
 */
public enum Level {

    INICIANTE,
    INTERMEDIARIO,
    AVANCADO;

    @JsonCreator
    public static Level fromString(String value) {
        if (value == null) {
            return null;
        }
        try {
            return Level.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Nível inválido: " + value + ". Valores aceitos: INICIANTE, INTERMEDIARIO, AVANCADO.");
        }
    }

    @JsonValue
    public String toValue() {
        return name();
    }
}
