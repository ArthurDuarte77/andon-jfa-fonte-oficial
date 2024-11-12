package com.api.nodemcu.controllers;


import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.api.nodemcu.model.GeralCiclosModel;
import com.api.nodemcu.model.NodemcuModel;
import com.api.nodemcu.repository.GeralCicloRepository;
import com.api.nodemcu.repository.OperationRepository;

import java.util.List;

@RestController
@RequestMapping("/api/v1/geral/ciclo")
public class GeralCiclosController {

    @Autowired
    private GeralCicloRepository geralCicloRepository;

    @Autowired
    private OperationRepository operationRepository;


    @GetMapping("/{name}")
    public List<GeralCiclosModel> getByName(@PathVariable String name){
        return geralCicloRepository.findByNameId(operationRepository.findByName(name));
    }

    @PostMapping()
    public GeralCiclosModel post(@RequestBody GeralCiclosModel device) {
        geralCicloRepository.save(device);
        return device;
    }

}
