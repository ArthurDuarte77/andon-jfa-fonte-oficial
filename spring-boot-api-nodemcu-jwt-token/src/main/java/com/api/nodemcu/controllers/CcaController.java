package com.api.nodemcu.controllers;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.nodemcu.model.CcaModel;
import com.api.nodemcu.repository.CcaRepository;

@RestController
@RequestMapping("/api/v1/cca")
public class CcaController {

    @Autowired CcaRepository ccaRepository;

    @GetMapping("/{id}")
    private Optional<CcaModel> FindById(@PathVariable("id") Long id){
        return ccaRepository.findById(id);
    }
    
    @PatchMapping("/{id}")
    private CcaModel update(@PathVariable("id") Long id, @RequestBody CcaModel cca){
        Optional<CcaModel> ccaOption = ccaRepository.findById(id);
        ccaOption.get().setMin(cca.getMin());
        ccaOption.get().setMax(cca.getMax());
        return ccaRepository.save(ccaOption.get());
    }

}
