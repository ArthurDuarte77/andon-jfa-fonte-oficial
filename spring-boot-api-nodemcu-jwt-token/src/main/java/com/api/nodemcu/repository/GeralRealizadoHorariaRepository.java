package com.api.nodemcu.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.nodemcu.model.GeralRealizadoHorariaModel;

public interface GeralRealizadoHorariaRepository extends JpaRepository<GeralRealizadoHorariaModel, Integer>{

    List<GeralRealizadoHorariaModel> findAll();

    <GeralRealizado extends GeralRealizadoHorariaModel> GeralRealizado save(GeralRealizado nodemcu);
    
}
