package com.api.nodemcu.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.nodemcu.model.CcaModel;

public interface CcaRepository extends JpaRepository<CcaModel, Long>{

    Optional<CcaModel> findById(Long id); 

    <CcaMod extends CcaModel> CcaMod save(CcaMod cca);

}
