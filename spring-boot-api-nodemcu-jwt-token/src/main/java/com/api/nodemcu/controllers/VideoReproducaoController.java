package com.api.nodemcu.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.nodemcu.model.OperationModel;
import com.api.nodemcu.model.VideoModel;
import com.api.nodemcu.model.VideoReproducaoModel;
import com.api.nodemcu.repository.OperationRepository;
import com.api.nodemcu.repository.VideoReproducaoRepository;


@RestController
@RequestMapping("/api/v1/video")
public class VideoReproducaoController {
    
    @Autowired
    private VideoReproducaoRepository videoReproducaoRepository;
    
    @Autowired
    private OperationRepository operationRepository;

    @GetMapping()
    public List<VideoReproducaoModel> getAll(){
        return videoReproducaoRepository.findAll();
    }

    @PostMapping()
    VideoReproducaoModel post(@RequestBody VideoReproducaoModel video){
        return videoReproducaoRepository.save(video);
    }

    @GetMapping("/{name}")
    List<VideoReproducaoModel> getByName(@PathVariable("name") String name){
        OperationModel operation = operationRepository.findByName(name);
        return videoReproducaoRepository.findByNameId(operation);
    }

}
