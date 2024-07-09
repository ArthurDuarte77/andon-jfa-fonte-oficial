package com.api.nodemcu.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name="operation")
public class OperationModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    private String name;

    private Integer limitedTime;


}

