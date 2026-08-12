package com.desafio.neki.exception;

import org.springframework.http.HttpStatus;

/**
 * Exceção de negócio que carrega o status HTTP e a mensagem
 * a serem devolvidos ao cliente.
 */
public class BusinessException extends RuntimeException {

    private final HttpStatus status;

    public BusinessException(String message) {
        this(HttpStatus.BAD_REQUEST, message);
    }

    public BusinessException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
