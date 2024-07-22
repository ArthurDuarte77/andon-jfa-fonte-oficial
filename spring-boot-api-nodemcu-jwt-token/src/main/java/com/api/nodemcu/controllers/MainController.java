package com.api.nodemcu.controllers;

import com.api.nodemcu.model.ImpostoDTO;
import com.api.nodemcu.model.MainModel;
import com.api.nodemcu.repository.MainRepostory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/main")
public class MainController {

    @Autowired
    MainRepostory repostory;

    @GetMapping()
    public List<MainModel> listAll(){
        return repostory.findAll();
    }

    @PutMapping("/{id}")
    public void put(@PathVariable Integer id, @RequestBody MainModel dto) {
        MainModel main = repostory.findById(id).get();
        main.setImposto(dto.getImposto());
        main.setTCimposto(dto.getTCimposto());
        main.setShiftTime(dto.getShiftTime());
        main.setOp(dto.getOp());
        repostory.save(main);
    }





}
