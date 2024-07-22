package com.api.nodemcu.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name="main")
public class MainModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    private Float imposto;

    private Float TCimposto;

    private Float shiftTime;

    private String op;

}
