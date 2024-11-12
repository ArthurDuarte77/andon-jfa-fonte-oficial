package com.api.nodemcu.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.nodemcu.model.OperationModel;
import com.api.nodemcu.model.RealizadoHorariaModel;
import com.api.nodemcu.model.RealizadoHorariaTabletModel;
import com.api.nodemcu.repository.OperationRepository;
import com.api.nodemcu.repository.RealizadoHorariaRepository;
import com.api.nodemcu.repository.RealizadoHorariaTabletRepository;

@RestController
@RequestMapping("/api/v1/realizadoHorariaTablet")
public class RealizadoHorariaTabletController {
    @Autowired
    private RealizadoHorariaTabletRepository repository;

    @Autowired
    private OperationRepository operationRepository;

    @GetMapping()
    List<RealizadoHorariaTabletModel> findAll() {
        return repository.findAll();
    }

    @GetMapping("/{name}")
    RealizadoHorariaTabletModel findByNameId(@PathVariable String name){
        OperationModel operation = operationRepository.findByName(name);
        return repository.findByNameId(operation);
    }


    @PostMapping()
    RealizadoHorariaTabletModel post(@RequestBody RealizadoHorariaTabletModel realizado){
        return repository.save(realizado);
    }
}
