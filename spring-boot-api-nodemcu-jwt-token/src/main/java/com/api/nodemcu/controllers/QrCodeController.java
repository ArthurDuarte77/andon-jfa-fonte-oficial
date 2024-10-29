package com.api.nodemcu.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.nodemcu.model.PausaModel;
import com.api.nodemcu.model.QrCodeModel;
import com.api.nodemcu.repository.QrCodeRepository;

@RestController
@RequestMapping("/api/v1/qrcode")
public class QrCodeController {

    @Autowired
    private QrCodeRepository qrCodeRepository;

    @GetMapping()
    List<QrCodeModel> getAll(){
        return qrCodeRepository.findAll();
    }

    @PostMapping()
    public QrCodeModel post(@RequestBody QrCodeModel qrcode) {
        return qrCodeRepository.save(qrcode);
    }

}
