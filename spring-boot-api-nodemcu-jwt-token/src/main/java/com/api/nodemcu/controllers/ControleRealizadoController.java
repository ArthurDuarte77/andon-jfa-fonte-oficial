package com.api.nodemcu.controllers;

import com.api.nodemcu.model.ControleGeralModel;
import com.api.nodemcu.model.ControleRealizadoModel;
import com.api.nodemcu.repository.ControleGeralRepository;
import com.api.nodemcu.repository.ControleRealizadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/v1/realizado")
public class ControleRealizadoController {

    @Autowired
    ControleRealizadoRepository controleRealizadoRepository;

    @GetMapping()
    public List<ControleRealizadoModel> listAll() {
        return controleRealizadoRepository.findAll();
    }

    @PostMapping()
    public ControleRealizadoModel post(@RequestBody ControleRealizadoModel item) {
        controleRealizadoRepository.save(item);
        return item;
    }


}