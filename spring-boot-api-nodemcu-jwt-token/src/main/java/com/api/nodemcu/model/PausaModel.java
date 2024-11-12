package com.api.nodemcu.model;

import jakarta.persistence.*;
import lombok.Data;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.TimeZone;

@Entity
// @Data
@Table(name="pausa")
public class PausaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    private LocalDate data;

    private LocalTime horario;


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


    public Integer getId() {
        return id;
    }


    public void setId(Integer id) {
        this.id = id;
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

    
}
