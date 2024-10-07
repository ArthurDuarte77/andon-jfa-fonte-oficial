package com.api.nodemcu.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.api.nodemcu.model.GeralRealizadoHorariaModel;
import com.api.nodemcu.model.PausaModel;
import com.api.nodemcu.model.VideoModel;

public interface VideoRepository extends JpaRepository<VideoModel, Integer>{
    List<VideoModel> findAll();


    <PausaMod extends VideoModel> PausaMod save(PausaMod pausa);

        
    @Query(value="SELECT * FROM video  WHERE data BETWEEN :startDate AND :endDate", nativeQuery=true)
    List<VideoModel> findByDataBetween(@Param("startDate") String startDate, @Param("endDate") String endDate);
}
