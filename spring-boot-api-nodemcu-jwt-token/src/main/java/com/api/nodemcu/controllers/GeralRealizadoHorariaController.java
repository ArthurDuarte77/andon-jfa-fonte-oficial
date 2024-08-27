package com.api.nodemcu.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.api.nodemcu.model.GeralRealizadoHorariaModel;
import com.api.nodemcu.repository.GeralRealizadoHorariaRepository;

import java.util.List;

@RestController
@RequestMapping("/api/v1/geral/realizadoHoraria")
public class GeralRealizadoHorariaController {

    @Autowired
    private GeralRealizadoHorariaRepository geralRealizadoHorariaRepository;

    @GetMapping("/filterByDate")
    public List<GeralRealizadoHorariaModel> filterByDate(@RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate) {
        return geralRealizadoHorariaRepository.findByDataBetween(startDate, endDate);
    }
}
