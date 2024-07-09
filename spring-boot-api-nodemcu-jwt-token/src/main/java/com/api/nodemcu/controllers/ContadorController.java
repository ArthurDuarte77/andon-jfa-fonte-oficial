package com.api.nodemcu.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.api.nodemcu.model.Contador;
import com.api.nodemcu.model.NodemcuModel;
import com.api.nodemcu.repository.ContadorRepository;
import com.api.nodemcu.repository.NodemcuRepository;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/v1/contadores")
public class ContadorController {

    @Autowired
    private ContadorRepository contadorRepository;

    @Autowired
    private NodemcuRepository nodemcuRepository;


    private ScheduledExecutorService executorService = Executors.newScheduledThreadPool(10);
    private ConcurrentHashMap<Long, ScheduledFuture<?>> contadorTasks = new ConcurrentHashMap<>();


    @GetMapping("/{id}/{isCounting}")
    public void atualizarTempo(@PathVariable("id") Long id, @PathVariable("isCounting") boolean isCounting) {
        Contador contador = contadorRepository.findById(id).orElse(null);
        if (contador == null) {
            return;
        }
        if (isCounting) {
            if (!contadorTasks.containsKey(id) || contadorTasks.get(id).isCancelled()) {
                contador.set_couting(true);
                ScheduledFuture<?> futureTask = executorService.scheduleAtFixedRate(() -> {
                    contador.setContadorAtual(contador.getContadorAtual() + 1);
                    contadorRepository.save(contador);
                }, 0, 1, TimeUnit.SECONDS);
                contadorTasks.put(id, futureTask);
            }
        } else {
            if (contadorTasks.containsKey(id) && !contadorTasks.get(id).isCancelled()) {
                contador.set_couting(false);
                contador.setContadorAtual(0);
                contadorTasks.get(id).cancel(true);
                contadorTasks.remove(id);
                contadorRepository.save(contador);
            }
        }
    }
    @GetMapping("/todos")
    public ResponseEntity<List<Contador>> todosContadores() {
        List<Contador> contadores = contadorRepository.findAll();
        return ResponseEntity.ok(contadores);
    }
}
