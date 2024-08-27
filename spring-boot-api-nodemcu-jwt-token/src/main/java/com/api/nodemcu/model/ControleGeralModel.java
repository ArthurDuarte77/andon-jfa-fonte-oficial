package com.api.nodemcu.model;

import java.util.Date;
import java.util.TimeZone;

import jakarta.persistence.*;
import lombok.Data;

@Entity
// @Data
@Table(name = "geral")
public class ControleGeralModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    private Integer imposto;

    private Integer realizado;

    private Date data;

    private String modelo;

    @PrePersist
    protected void prePersist() {
        if (this.data == null) {
            TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
            data = new Date();
        }
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Integer getImposto() {
        return imposto;
    }

    public void setImposto(Integer imposto) {
        this.imposto = imposto;
    }

    public Integer getRealizado() {
        return realizado;
    }

    public void setRealizado(Integer realizado) {
        this.realizado = realizado;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    
}
