package com.api.nodemcu.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.api.nodemcu.model.GeralMainModel;
import com.api.nodemcu.model.NodemcuModel;


public interface GeralMainRepository extends JpaRepository<GeralMainModel, Integer>{

    List<GeralMainModel> findAll();

    <GeralRealizado extends GeralMainModel> GeralRealizado save(GeralRealizado nodemcu);
    
    @Query(value="SELECT n FROM geral_main n WHERE n.data BETWEEN :startDate AND :endDate", nativeQuery=true)
    List<GeralMainModel> findByDataBetween(@Param("startDate") String startDate, @Param("endDate") String endDate);
}
