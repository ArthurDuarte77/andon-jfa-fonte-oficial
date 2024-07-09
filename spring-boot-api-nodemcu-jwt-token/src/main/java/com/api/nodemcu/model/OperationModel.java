package com.api.nodemcu.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.TimeZone;

import javax.swing.text.StyledEditorKit.BoldAction;

@Entity
@Data
@Table(name="operation")
public class OperationModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    private String name;

    private Boolean ocupado;

    private Boolean pausa;

    private Boolean analise;

}

