package com.api.nodemcu.model;

public class OperationDTO {
    private Integer id;

    private String name;

    private Boolean ocupado;

    private Boolean pausa;

    private Boolean analise;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getOcupado() {
        return ocupado;
    }

    public void setOcupado(Boolean ocupado) {
        this.ocupado = ocupado;
    }

    public Boolean getPausa() {
        return pausa;
    }

    public void setPausa(Boolean pausa) {
        this.pausa = pausa;
    }

    public Boolean getAnalise() {
        return analise;
    }

    public void setAnalise(Boolean analise) {
        this.analise = analise;
    }

    
}
