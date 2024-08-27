package com.api.nodemcu.controllers;

import com.api.nodemcu.model.NodemcuModel;
import com.api.nodemcu.model.RealizadoHorariaModel;
import com.api.nodemcu.repository.RealizadoHorariaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/realizadoHoraria")
public class RealizadoHorariaController {

    @Autowired
    private RealizadoHorariaRepository repository;

    @GetMapping()
    List<RealizadoHorariaModel> findAll(){
        return  repository.findAll();
    }

    @PostMapping()
    RealizadoHorariaModel post(@RequestBody RealizadoHorariaModel item){
        return repository.save(item);
    }
}
