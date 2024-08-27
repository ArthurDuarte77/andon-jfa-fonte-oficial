package com.api.nodemcu.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.api.nodemcu.model.GeralNodemcuModel;
import com.api.nodemcu.model.NodemcuModel;

public interface GeralNodemcuRepository  extends JpaRepository<GeralNodemcuModel, Integer>{

    List<GeralNodemcuModel> findAll();

    <GeralRealizado extends GeralNodemcuModel> GeralRealizado save(GeralRealizado nodemcu);

    @Query(value="SELECT n FROM geral_realizadohoraria n WHERE n.data BETWEEN :startDate AND :endDate", nativeQuery=true)
    List<GeralNodemcuModel> findByDataBetween(@Param("startDate") String startDate, @Param("endDate") String endDate);
    
}
