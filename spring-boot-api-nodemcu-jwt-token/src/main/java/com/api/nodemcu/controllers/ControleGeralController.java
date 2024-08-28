package com.api.nodemcu.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.nodemcu.model.ControleGeralModel;
import com.api.nodemcu.model.MainModel;
import com.api.nodemcu.model.NodemcuModel;
import com.api.nodemcu.model.OperationModel;
import com.api.nodemcu.repository.ControleGeralRepository;

import jakarta.persistence.criteria.CriteriaBuilder.In;

@RestController
@RequestMapping("/api/v1/geral")
public class ControleGeralController {

    @Autowired
    ControleGeralRepository controleGeralRepository;

    @GetMapping()
    public List<ControleGeralModel> listAll() {
        return controleGeralRepository.findAll();
    }

    @PostMapping()
    public ControleGeralModel post(@RequestBody ControleGeralModel item) {
        controleGeralRepository.save(item);
        return item;
    }

}
