package com.api.nodemcu.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.nodemcu.model.GeralMainModel;


public interface GeralMainRepository extends JpaRepository<GeralMainModel, Integer>{

    List<GeralMainModel> findAll();

    <GeralRealizado extends GeralMainModel> GeralRealizado save(GeralRealizado nodemcu);
    
}
