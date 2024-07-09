package com.api.nodemcu.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.nodemcu.model.Contador;

public interface ContadorRepository extends JpaRepository<Contador, Long> {
}

