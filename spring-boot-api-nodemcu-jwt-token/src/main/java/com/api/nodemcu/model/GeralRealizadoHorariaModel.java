package com.api.nodemcu.model;

import java.util.Date;
import java.util.TimeZone;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "geral_realizadohoraria")
public class GeralRealizadoHorariaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    private Date data;

    private Integer horas7;
    private Integer horas8;
    private Integer horas9;
    private Integer horas10;
    private Integer horas11;
    private Integer horas12;
    private Integer horas13;
    private Integer horas14;
    private Integer horas15;
    private Integer horas16;
    private Integer horas17;

    @PrePersist
    protected void prePersist() {
        if (this.data == null) {
            TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
            data = new Date();
        }
    }
}
