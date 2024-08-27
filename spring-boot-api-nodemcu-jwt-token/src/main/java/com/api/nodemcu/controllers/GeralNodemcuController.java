package com.api.nodemcu.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.api.nodemcu.model.GeralNodemcuModel;
import com.api.nodemcu.model.OperationDTO;
import com.api.nodemcu.model.GeralNodemcuDTO;
import com.api.nodemcu.model.OperationModel;
import com.api.nodemcu.repository.GeralNodemcuRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/geral/nodemcu")
public class GeralNodemcuController {

    @Autowired
    private GeralNodemcuRepository geralNodemcuRepository;

    @GetMapping("/filterByDate")
    public List<GeralNodemcuDTO> filterByDate(@RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate) {
        List<GeralNodemcuModel> entities = geralNodemcuRepository.findByDataBetween(startDate, endDate);
        return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @GetMapping()
    public List<GeralNodemcuDTO> findAll() {
        List<GeralNodemcuModel> entities = geralNodemcuRepository.findAll();
        return entities.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private GeralNodemcuDTO convertToDTO(GeralNodemcuModel entity) {
        GeralNodemcuDTO dto = new GeralNodemcuDTO();
        dto.setId(entity.getId());
        dto.setNameId(convertToOperationDTO(entity.getNameId()));
        dto.setData(entity.getData());
        dto.setCount(entity.getCount());
        dto.setFirtlastTC(entity.getFirtlastTC());
        dto.setState(entity.getState());
        dto.setCurrentTC(entity.getCurrentTC());
        dto.setAnalise(entity.getAnalise());
        dto.setTime_excess(entity.getTime_excess());
        dto.setMaintenance(entity.getMaintenance());
        dto.setSecondtlastTC(entity.getSecondtlastTC());
        dto.setAjuda(entity.getAjuda());
        dto.setThirdlastTC(entity.getThirdlastTC());
        dto.setShortestTC(entity.getShortestTC());
        dto.setQtdetcexcedido(entity.getQtdetcexcedido());
        dto.setTcmedio(entity.getTcmedio());
        return dto;
    }

    private OperationDTO convertToOperationDTO(OperationModel operation) {
        if (operation == null) return null;
        OperationDTO dto = new OperationDTO();
        dto.setId(operation.getId());
        dto.setAnalise(operation.getAnalise());
        dto.setName(operation.getName());
        dto.setOcupado(operation.getOcupado());
        dto.setPausa(operation.getPausa());
        return dto;
    }
}
