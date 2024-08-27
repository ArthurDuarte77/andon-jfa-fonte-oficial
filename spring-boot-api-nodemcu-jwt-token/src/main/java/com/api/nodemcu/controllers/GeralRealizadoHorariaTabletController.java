package com.api.nodemcu.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.api.nodemcu.model.GeralNodemcuModel;
import com.api.nodemcu.model.GeralRealizadoHorariaTabletModel;
import com.api.nodemcu.repository.GeralRealizadoHorariaTabletRepository;

import java.util.List;

@RestController
@RequestMapping("/api/v1/geral/realizadoHorariaTablet")
public class GeralRealizadoHorariaTabletController {

    @Autowired
    private GeralRealizadoHorariaTabletRepository geralRealizadoHorariaTabletRepository;

    @GetMapping("/filterByDate")
    public List<GeralRealizadoHorariaTabletModel> filterByDate(@RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate) {
        return geralRealizadoHorariaTabletRepository.findByDataBetween(startDate, endDate);
    }

    @GetMapping()
    public List<GeralRealizadoHorariaTabletModel> findAll(){
        return geralRealizadoHorariaTabletRepository.findAll();
    }
}
