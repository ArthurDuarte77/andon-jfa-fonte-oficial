package com.api.nodemcu.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.api.nodemcu.model.GeralNodemcuModel;
import com.api.nodemcu.model.GeralRealizadoHorariaModel;

public interface GeralRealizadoHorariaRepository extends JpaRepository<GeralRealizadoHorariaModel, Integer>{

    List<GeralRealizadoHorariaModel> findAll();

    <GeralRealizado extends GeralRealizadoHorariaModel> GeralRealizado save(GeralRealizado nodemcu);
    
    @Query(value="SELECT * FROM geral_realizadohoraria  WHERE data BETWEEN :startDate AND :endDate", nativeQuery=true)
    List<GeralRealizadoHorariaModel> findByDataBetween(@Param("startDate") String startDate, @Param("endDate") String endDate);
    
}
