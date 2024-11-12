package com.api.nodemcu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.api.nodemcu.model.OperationModel;
import com.api.nodemcu.model.RealizadoHorariaTabletModel;
import org.springframework.data.repository.query.Param;

public interface RealizadoHorariaTabletRepository extends JpaRepository<RealizadoHorariaTabletModel, Integer> {
    List<RealizadoHorariaTabletModel> findAll();

    @Query(value = "SELECT SUM(horas10 + horas11 + horas12 + horas13 + horas14 + horas15 + horas16 + horas17 + horas7 + horas8 + horas9) AS total_soma FROM realizadohoraria_tablet WHERE id = :id", nativeQuery = true)
    Integer somarTudo(@Param("id") Integer id);

    RealizadoHorariaTabletModel findByNameId(OperationModel name);

    <RealizadoHorariaTabletMod extends RealizadoHorariaTabletModel> RealizadoHorariaTabletMod save(RealizadoHorariaTabletMod nodemcu);
}
