package com.api.nodemcu.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.nodemcu.model.GeralRealizadoHorariaTabletModel;

public interface GeralRealizadoHorariaTabletRepository extends JpaRepository<GeralRealizadoHorariaTabletModel, Integer>{

    List<GeralRealizadoHorariaTabletModel> findAll();

    <GeralRealizado extends GeralRealizadoHorariaTabletModel> GeralRealizado save(GeralRealizado nodemcu);
    
}
