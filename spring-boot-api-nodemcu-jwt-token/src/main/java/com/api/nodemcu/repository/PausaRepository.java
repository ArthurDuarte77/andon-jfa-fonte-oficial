package com.api.nodemcu.repository;

import com.api.nodemcu.model.OperationModel;
import com.api.nodemcu.model.PausaModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PausaRepository extends JpaRepository<PausaModel, Integer> {

    List<PausaModel> findAll();


    <PausaMod extends PausaModel> PausaMod save(PausaMod pausa);

}
