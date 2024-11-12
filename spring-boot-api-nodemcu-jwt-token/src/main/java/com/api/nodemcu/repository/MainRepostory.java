package com.api.nodemcu.repository;

import com.api.nodemcu.model.MainModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MainRepostory extends JpaRepository<MainModel, Integer> {

    List<MainModel> findAll();

    Optional<MainModel> findById(Integer id);

    <MainMod extends MainModel> MainMod save(MainMod nodemcu);

}
