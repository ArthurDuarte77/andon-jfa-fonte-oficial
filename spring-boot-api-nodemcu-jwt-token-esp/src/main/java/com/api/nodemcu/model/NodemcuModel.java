package com.api.nodemcu.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

import java.util.TimeZone;

@Entity
@Data
@Table(name="thdados")
public class NodemcuModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @OneToOne
    @JoinColumn(name = "name_id")
    private OperationModel nameId;


    private String state;

}

