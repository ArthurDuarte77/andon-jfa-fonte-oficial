package com.api.nodemcu.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.TimeZone;

import jakarta.persistence.*;
import lombok.Data;


@Entity
@Table(name = "reproducao")
public class VideoReproducaoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @OneToOne
    @JoinColumn(name = "name_id")
    private OperationModel nameId;

    private String codigo;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public OperationModel getNameId() {
        return nameId;
    }

    public void setNameId(OperationModel nameId) {
        this.nameId = nameId;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }


    

}
