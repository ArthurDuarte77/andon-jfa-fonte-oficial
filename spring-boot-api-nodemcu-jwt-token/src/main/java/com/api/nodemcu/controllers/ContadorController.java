package com.api.nodemcu.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.api.nodemcu.model.Contador;
import com.api.nodemcu.repository.ContadorRepository;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/v1/contadores")
@EnableScheduling
public class ContadorController {

    @Autowired
    private ContadorRepository contadorRepository;

    private final ScheduledExecutorService executorService = Executors.newScheduledThreadPool(10);
    private final ConcurrentHashMap<Long, ScheduledFuture<?>> contadorTasks = new ConcurrentHashMap<>();

    @PutMapping("/{id}/{isCounting}")
    public ResponseEntity<Void> atualizarTempo(@PathVariable("id") Long id, @PathVariable("isCounting") boolean isCounting) {
        Contador contador = contadorRepository.findById(id).orElse(null);
        if (contador == null) {
            return ResponseEntity.notFound().build();
        }

        ScheduledFuture<?> task = contadorTasks.get(id);

        if (isCounting) {
            if (task == null || task.isCancelled()) {
                contador.setIs_couting(true);
                task = executorService.scheduleAtFixedRate(() -> updateContador(contador), 0, 1, TimeUnit.SECONDS);
                contadorTasks.put(id, task);
            }
        } else {
            if (task != null && !task.isCancelled()) {
                task.cancel(true);
                contadorTasks.remove(id);
                contador.setIs_couting(false);
                contador.setContadorAtual(0);
                contadorRepository.save(contador);
            }
        }
        return ResponseEntity.ok().build();
    }

    @Transactional
    public void updateContador(Contador contador) {
        contador.setContadorAtual(contador.getContadorAtual() + 1);
        contadorRepository.save(contador);
    }

    @GetMapping("/todos")
    public ResponseEntity<List<Contador>> todosContadores() {
        List<Contador> contadores = contadorRepository.findAll();
        return ResponseEntity.ok(contadores);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contador> findById(@PathVariable("id") Long id) {
        return contadorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
