package com.api.nodemcu.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "contador")
public class Contador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int contadorAtual;
    private boolean is_couting;

}
