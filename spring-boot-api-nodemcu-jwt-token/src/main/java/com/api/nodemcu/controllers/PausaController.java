package com.api.nodemcu.controllers;

import com.api.nodemcu.model.FontesModel;
import com.api.nodemcu.model.PausaModel;
import com.api.nodemcu.repository.PausaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pausa")
public class PausaController {

    @Autowired
    private PausaRepository pausaRepository;


    @GetMapping()
    List<PausaModel> getAll(){
        return pausaRepository.findAll();
    }

    @PostMapping()
    public PausaModel post(@RequestBody PausaModel pausa) {
        return pausaRepository.save(pausa);
    }

}
