package com.api.nodemcu.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.nodemcu.model.GeralNodemcuModel;

public interface GeralNodemcuRepository  extends JpaRepository<GeralNodemcuModel, Integer>{

    List<GeralNodemcuModel> findAll();

    <GeralRealizado extends GeralNodemcuModel> GeralRealizado save(GeralRealizado nodemcu);
    
}
