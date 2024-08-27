package com.api.nodemcu.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
// @Data
@Table(name = "contador")
public class Contador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int contadorAtual;
    private boolean is_couting;
    
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public int getContadorAtual() {
        return contadorAtual;
    }
    public void setContadorAtual(int contadorAtual) {
        this.contadorAtual = contadorAtual;
    }
    public boolean isIs_couting() {
        return is_couting;
    }
    public void setIs_couting(boolean is_couting) {
        this.is_couting = is_couting;
    }

    
}

