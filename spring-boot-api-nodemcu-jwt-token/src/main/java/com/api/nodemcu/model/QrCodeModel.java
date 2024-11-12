package com.api.nodemcu.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;

@Entity
@Table(name="qrcode")
public class QrCodeModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    private String op;

    private String name;

    private LocalDate data;

    private LocalTime horario;

    private String cod;
    
    private Boolean aprovado;

    private Integer execucao;

    @PrePersist
    protected void prePersist() {
        ZoneId zoneId = ZoneId.of("America/Sao_Paulo");
        if (this.data == null) {
            this.data = LocalDate.now(zoneId);
        }
        if (this.horario == null) {
            this.horario = LocalTime.now(zoneId);
        }
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getOp() {
        return op;
    }

    public void setOp(String op) {
        this.op = op;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public LocalTime getHorario() {
        return horario;
    }

    public void setHorario(LocalTime horario) {
        this.horario = horario;
    }

    public String getCod() {
        return cod;
    }

    public void setCod(String cod) {
        this.cod = cod;
    }

    public Boolean getAprovado() {
        return aprovado;
    }

    public void setAprovado(Boolean aprovado) {
        this.aprovado = aprovado;
    }

    public Integer getExecucao() {
        return execucao;
    }

    public void setExecucao(Integer execucao) {
        this.execucao = execucao;
    }
   
    

}
