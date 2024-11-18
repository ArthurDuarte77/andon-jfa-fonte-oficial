package com.api.nodemcu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.api.nodemcu.model.GeralCiclosModel;
import com.api.nodemcu.model.OperationModel;

public interface GeralCicloRepository extends JpaRepository<GeralCiclosModel, Integer>{

    List<GeralCiclosModel> findAll();

    List<GeralCiclosModel> findByNameId(OperationModel name_id);


    <GeralRealizado extends GeralCiclosModel> GeralRealizado save(GeralRealizado nodemcu);

    @Query(value="SELECT * FROM geral_ciclo WHERE data BETWEEN :startDate AND :endDate AND name_id = :name_id", nativeQuery=true)
    List<GeralCiclosModel> findByDataBetween(@Param("startDate") String startDate, @Param("endDate") String endDate, @Param("name_id") Integer name_id);

}
