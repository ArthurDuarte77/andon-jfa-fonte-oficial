package com.api.nodemcu.repository;

import com.api.nodemcu.model.ControleRealizadoModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ControleRealizadoRepository extends JpaRepository<ControleRealizadoModel, Integer> {
    List<ControleRealizadoModel> findAll();

    Optional<ControleRealizadoModel> findById(Integer id);

    <ControleRealizadoMod extends ControleRealizadoModel> ControleRealizadoMod save(ControleRealizadoMod nodemcu);
}