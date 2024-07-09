package com.api.nodemcu.repository;

import com.api.nodemcu.model.OperationModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OperationRepository extends JpaRepository<OperationModel, Integer> {
    List<OperationModel> findAll();

    OperationModel findByName(String name);

    <OperationMod extends OperationModel> OperationMod save(OperationMod nodemcu);

    @Modifying
    @Query(value = "update operation set ocupado = :ocupado where id = :id", nativeQuery = true)
    void updateOcupadoByName(@Param("ocupado") Boolean ocupado, @Param("id") Integer id);

    @Modifying
    @Query(value = "update operation set analise = :analise where id = :id", nativeQuery = true)
    void updateAnaliseById(@Param("analise") Boolean analise, @Param("id") Integer id);
}
