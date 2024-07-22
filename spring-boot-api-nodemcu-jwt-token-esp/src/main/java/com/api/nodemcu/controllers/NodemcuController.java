package com.api.nodemcu.controllers;

import com.api.nodemcu.model.NodemcuModel;
import com.api.nodemcu.model.NodemcuStateDTO;
import com.api.nodemcu.model.OperationModel;
import com.api.nodemcu.repository.NodemcuRepository;
import com.api.nodemcu.repository.OperationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/nodemcu")
public class NodemcuController {


    @Autowired
    private NodemcuRepository repository;

    @Autowired
    private OperationRepository operationRepository;




    @GetMapping("/{name}")
    public NodemcuStateDTO findStateByName(@PathVariable String name) {
        OperationModel operation = operationRepository.findByName(name);
        NodemcuModel nodemcu = repository.findByNameId(operation);
        return new NodemcuStateDTO(nodemcu.getState());
    }


}