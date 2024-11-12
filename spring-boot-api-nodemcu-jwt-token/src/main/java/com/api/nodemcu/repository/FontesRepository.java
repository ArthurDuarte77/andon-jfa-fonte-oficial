package com.api.nodemcu.repository;

import com.api.nodemcu.model.FontesModel;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FontesRepository extends JpaRepository<FontesModel, Integer> {

    List<FontesModel> findAll();

    FontesModel findBymodelo(String modelo);

    <FontesMod extends FontesModel> FontesMod save(FontesMod fonte);

}
