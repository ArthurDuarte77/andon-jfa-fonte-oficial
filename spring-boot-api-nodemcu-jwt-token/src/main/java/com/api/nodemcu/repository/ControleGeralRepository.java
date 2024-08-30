package com.api.nodemcu.repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.api.nodemcu.model.ControleGeralModel;
import com.api.nodemcu.model.GeralMainModel;

public interface ControleGeralRepository extends JpaRepository<ControleGeralModel, Integer>{

    List<ControleGeralModel> findAll();

    Optional<ControleGeralModel> findById(Integer id);

    <ControleGeralMod extends ControleGeralModel> ControleGeralMod save(ControleGeralMod nodemcu);
    
    @Query(value="SELECT * FROM geral WHERE data BETWEEN :startDate AND :endDate", nativeQuery=true)
    List<ControleGeralModel> findByDataBetween(@Param("startDate") String startDate, @Param("endDate") String endDate);
    
}
