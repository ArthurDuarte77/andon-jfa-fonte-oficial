package com.api.nodemcu.controllers;

import com.api.nodemcu.repository.GeralNodemcuRepository;
import com.api.nodemcu.model.GeralNodemcuModel;
import com.api.nodemcu.model.NodemcuModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/geral/nodemcu")
public class GeralNodemcuController {
    

    @Autowired
    private GeralNodemcuRepository geralNodemcuRepository;

    @GetMapping("/filterByDate")
    public List<GeralNodemcuModel> filterByDate(@RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate) {
        return geralNodemcuRepository.findByDataBetween(startDate, endDate);
    }


}
