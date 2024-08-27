package com.api.nodemcu.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.TimeZone;

@Entity
// @Data
@Table(name = "realizado")
public class ControleRealizadoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    private Integer imposto;

    private Integer realizado;

    private Integer realizadoHora;
    private String justificativa;

    private Date data;

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

    public Integer getRealizadoHora() {
        return realizadoHora;
    }

    public void setRealizadoHora(Integer realizadoHora) {
        this.realizadoHora = realizadoHora;
    }

    public String getJustificativa() {
        return justificativa;
    }

    public void setJustificativa(String justificativa) {
        this.justificativa = justificativa;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    
}