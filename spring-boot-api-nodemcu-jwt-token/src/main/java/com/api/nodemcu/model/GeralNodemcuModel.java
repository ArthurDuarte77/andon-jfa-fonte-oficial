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
@Table(name="geral_thdados")
public class GeralNodemcuModel {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @OneToOne
    @JoinColumn(name = "name_id")
    private OperationModel nameId;

    private Date data;

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


    @PrePersist
    protected void prePersist() {
        if (this.data == null) {
            TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
            data = new Date();
        }
    }
}


