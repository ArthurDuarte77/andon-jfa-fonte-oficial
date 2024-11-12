package com.api.nodemcu.repository;

import com.api.nodemcu.model.NodemcuModel;
import com.api.nodemcu.model.OperationModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OperationRepository extends JpaRepository<OperationModel, Integer> {
    List<OperationModel> findAll();

    OperationModel findByName(String name);

    <OperationMod extends OperationModel> OperationMod save(OperationMod nodemcu);
}
