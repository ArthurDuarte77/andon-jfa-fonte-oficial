package com.api.nodemcu.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.api.nodemcu.model.OperationModel;
import com.api.nodemcu.model.VideoReproducaoModel;

public interface VideoReproducaoRepository extends JpaRepository<VideoReproducaoModel, Integer> {

    List<VideoReproducaoModel> findAll();

    <PausaMod extends VideoReproducaoModel> PausaMod save(PausaMod pausa);

    List<VideoReproducaoModel> findByNameId(OperationModel name);

}
