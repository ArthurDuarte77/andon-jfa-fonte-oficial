package com.api.nodemcu.model;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name="fontes")
public class FontesModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    private String modelo;

    private Integer realizado;

    private Integer tempo;

}
