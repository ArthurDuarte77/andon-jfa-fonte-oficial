package com.api.nodemcu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.nodemcu.model.PausaModel;
import com.api.nodemcu.model.QrCodeModel;

public interface QrCodeRepository extends JpaRepository<QrCodeModel, Integer>{
        
    List<QrCodeModel> findAll();

    <QrCodeMod extends QrCodeModel> QrCodeMod save(QrCodeMod pausa);
}
