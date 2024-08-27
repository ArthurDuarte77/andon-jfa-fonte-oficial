package com.api.nodemcu.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.api.nodemcu.model.GeralRealizadoHorariaModel;
import com.api.nodemcu.model.GeralRealizadoHorariaTabletModel;

public interface GeralRealizadoHorariaTabletRepository extends JpaRepository<GeralRealizadoHorariaTabletModel, Integer>{

    List<GeralRealizadoHorariaTabletModel> findAll();

    <GeralRealizado extends GeralRealizadoHorariaTabletModel> GeralRealizado save(GeralRealizado nodemcu);

    @Query(value="SELECT n FROM geral_thdados n WHERE n.data BETWEEN :startDate AND :endDate", nativeQuery=true)
    List<GeralRealizadoHorariaTabletModel> findByDataBetween(@Param("startDate") String startDate, @Param("endDate") String endDate);
    
}
