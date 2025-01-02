package com.api.nodemcu.controllers;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.nodemcu.Services.NodemcuService;
import com.api.nodemcu.model.NodemcuModel;

@RestController
@RequestMapping("/api/v1/nodemcu")
public class NodemcuController {
    private final NodemcuService nodemcuService;

    @Autowired
    public NodemcuController(NodemcuService nodemcuService) {
        this.nodemcuService = nodemcuService;
    }

    @GetMapping
    public List<NodemcuModel> list() {
        return nodemcuService.listAll();
    }

    @GetMapping("/{name}")
    public NodemcuModel findByName(@PathVariable String name) {
        return nodemcuService.findByName(name);
    }

    @GetMapping("/timeExcess/{name}")
    public void addTimeExcess(@PathVariable String name) {
         nodemcuService.addTimeExcess(name);
    }
    
    @GetMapping("/zerar")
    public void zerar() {
        nodemcuService.zerarDados();
    }

    @GetMapping("/ajuda/{name}")
    public void addAjuda(@PathVariable String name) {
        nodemcuService.addAjuda(name);
    }

    @PostMapping
    public NodemcuModel post(@RequestBody NodemcuModel device) {
        return nodemcuService.save(device);
    }

    @PatchMapping("/{name}")
    public NodemcuModel patch(@PathVariable String name, @RequestBody NodemcuModel nodemcuUpdates)
            throws IOException, InterruptedException {
        return nodemcuService.update(name, nodemcuUpdates);
    }

    @GetMapping("/atualizarState/{name}/{state}")
    public void atualizarCor(@PathVariable String name, @PathVariable String state) {
         nodemcuService.updateState(name, state);
    }

    @GetMapping("/atualizarTempo/{name}/{tempo}")
    public void iniciarTempo(@PathVariable String name, @PathVariable Integer tempo) {
         nodemcuService.updateLocalTC(name, tempo);
    }
}