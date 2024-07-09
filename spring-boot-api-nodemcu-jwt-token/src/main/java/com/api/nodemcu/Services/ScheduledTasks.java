package com.api.nodemcu.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import com.api.nodemcu.controllers.ContadorController;
import com.api.nodemcu.model.Contador;
import com.api.nodemcu.repository.ContadorRepository;

@Configuration
@EnableScheduling
public class ScheduledTasks {

    @Autowired
    private ContadorRepository contadorRepository;

    @Scheduled(fixedRate = 1000)
    public void reportCurrentTime() {
        // Incrementa todos os contadores a cada segundo
        for (Contador contador : contadorRepository.findAll()) {
            contador.setContadorAtual(contador.getContadorAtual() + 1);
        }
    }
}


