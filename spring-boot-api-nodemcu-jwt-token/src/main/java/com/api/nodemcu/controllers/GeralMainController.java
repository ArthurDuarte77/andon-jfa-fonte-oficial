package com.api.nodemcu.controllers;

import com.api.nodemcu.model.GeralMainModel;
import com.api.nodemcu.model.NodemcuModel;
import com.api.nodemcu.repository.GeralMainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/geral/main")
public class GeralMainController {

    @Autowired
    private GeralMainRepository geralMainRepository;

    @GetMapping("/filterByDate")
    public List<GeralMainModel> filterByDate(@RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate) {
        return geralMainRepository.findByDataBetween(startDate, endDate);
    }

    @GetMapping()
    public List<GeralMainModel> findAll(){
        return geralMainRepository.findAll();
    }


}
