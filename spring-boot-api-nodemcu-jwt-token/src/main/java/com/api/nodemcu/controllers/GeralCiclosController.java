package com.api.nodemcu.controllers;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.api.nodemcu.model.GeralCiclosModel;
import com.api.nodemcu.repository.GeralCicloRepository;
import com.api.nodemcu.repository.OperationRepository;

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

    @GetMapping("/filterByDate/{name}")
    public List<GeralCiclosModel> filterByDate(@RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate, @PathVariable String name) {

        return geralCicloRepository.findByDataBetween(startDate, endDate, operationRepository.findByName(name).getId());
    }

}
