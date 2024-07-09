package com.api.nodemcu.model;

import jakarta.persistence.*;
import lombok.Data;
import org.apache.catalina.User;

import java.math.BigInteger;
import java.util.Date;
import java.util.List;
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

    @OneToOne
    @JoinColumn(name = "contador")
    private Contador contador;


    private Integer count;

    private Integer firtlastTC;

    private String state;

    private Integer currentTC;

    private Integer analise;

    private Integer time_excess;

    private Integer maintenance;

    private Integer secondtlastTC;

    private Integer ajuda;

    private Integer thirdlastTC;

    private Integer shortestTC;

    private Integer QtdeTCexcedido;

    private Integer TCmedio;



}

