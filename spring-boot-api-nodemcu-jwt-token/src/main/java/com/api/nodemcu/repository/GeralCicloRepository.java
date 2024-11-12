package com.api.nodemcu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.nodemcu.model.GeralCiclosModel;
import com.api.nodemcu.model.OperationModel;

public interface GeralCicloRepository extends JpaRepository<GeralCiclosModel, Integer>{

    List<GeralCiclosModel> findAll();

    List<GeralCiclosModel> findByNameId(OperationModel name_id);


    <GeralRealizado extends GeralCiclosModel> GeralRealizado save(GeralRealizado nodemcu);

}
