package com.desafio.neki.exception;

/**
 * Exceção lançada quando um recurso não é encontrado (HTTP 404).
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
