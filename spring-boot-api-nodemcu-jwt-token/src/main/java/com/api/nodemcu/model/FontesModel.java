package com.api.nodemcu.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
// @Data
@Table(name="fontes")
public class FontesModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    private String modelo;

    private Integer realizado;

    private Integer tempo;
    
    private Boolean is_current;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public Integer getRealizado() {
        return realizado;
    }

    public void setRealizado(Integer realizado) {
        this.realizado = realizado;
    }

    public Integer getTempo() {
        return tempo;
    }

    public void setTempo(Integer tempo) {
        this.tempo = tempo;
    }

    public Boolean getIs_current() {
        return is_current;
    }

    public void setIs_current(Boolean is_current) {
        this.is_current = is_current;
    }

    
}
