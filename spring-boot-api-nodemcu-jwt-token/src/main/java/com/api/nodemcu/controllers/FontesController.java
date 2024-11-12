package com.api.nodemcu.controllers;

import com.api.nodemcu.model.FontesModel;
import com.api.nodemcu.model.NodemcuModel;
import com.api.nodemcu.model.OperationModel;
import com.api.nodemcu.repository.FontesRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/fonte")
public class FontesController {

    @Autowired
    FontesRepository repository;

    @GetMapping()
    public List<FontesModel> listAll() {
        List<FontesModel> fontes = repository.findAll();
        return fontes;
    }

    @GetMapping("/isCurrent")
    public FontesModel findByIsCurrent() {
        List<FontesModel> fontes = repository.findAll();

        for(FontesModel fonte: fontes){
            if (fonte.getIs_current()){
                return fonte;
            }
        }
        return fontes.get(0);
    }


    @Transactional
    @GetMapping("/{modelo}/{isCurrent}")
    public void Update(@PathVariable String modelo, @PathVariable Boolean isCurrent) {
        if(modelo != ""){
            FontesModel fontes = repository.findBymodelo(modelo);
            fontes.setIs_current(isCurrent);
            repository.save(fontes);
        }
    }

    @PostMapping()
    public FontesModel post(@RequestBody FontesModel fonte) {
        return repository.save(fonte);
    }

}