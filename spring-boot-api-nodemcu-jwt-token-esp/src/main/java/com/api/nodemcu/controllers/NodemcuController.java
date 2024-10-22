package com.api.nodemcu.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import java.util.List;
import com.api.nodemcu.model.OperationModel;
import com.api.nodemcu.repository.NodemcuRepository;
import com.api.nodemcu.repository.OperationRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import jakarta.transaction.Transactional;
import java.util.HashMap;
import java.util.Map;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Controller
public class NodemcuController {
    @Autowired
    private NodemcuRepository nodemcuRepository;

    @Autowired
    private OperationRepository operationRepository;

    private final SimpMessagingTemplate messagingTemplate;

    public NodemcuController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    private Map<String, String> dados = new HashMap<>();

    @MessageMapping("/register")
    public void registerClient(SimpMessageHeaderAccessor headerAccessor, @Payload String message) {
        String sessionId = headerAccessor.getSessionId();
        System.out.println("Novo cliente registrado - SessionId: " + sessionId);
        ObjectMapper mapper = new ObjectMapper();
        try {
            JsonNode jsonNode = mapper.readTree(message);
            String op = jsonNode.get("op").asText();
            dados.put(op, sessionId);
            // enviarMensagemParaCliente(op);
        } catch (JsonProcessingException e) {
            System.out.println("Erro ao processar a mensagem JSON: " + e.getMessage());
        }
    }

    @Transactional
    @MessageMapping("/news")
    public void broadcastNews(@Payload String message) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode jsonNode;
        try {
            jsonNode = mapper.readTree(message);
        } catch (JsonMappingException e) {
            throw new JsonProcessingException("Erro ao mapear JSON") {
            };
        }

        String status = jsonNode.get("status").asText();
        String op = jsonNode.get("op").asText();
        OperationModel operation = operationRepository.findByName(op);
        try {
            nodemcuRepository.updateStateByNameId(status, operation.getId());
            String sessionId = dados.get(op);
            if (sessionId != null) {
                messagingTemplate.convertAndSend(
                        "/user/" + sessionId + "/news",
                        status);
            } else {
                System.out.println("Aviso: SessionId não encontrado para a operação " + op);
            }
        } catch (

        InvalidDataAccessApiUsageException e) {
            throw new RuntimeException(e);
        }
    }

    public void enviarMensagemParaCliente(String op) {

        OperationModel operation = operationRepository.findByName(op);
        if (operation != null) {
            Object resultado = nodemcuRepository.findByNameId(operation);
            if (resultado != null) {
                messagingTemplate.convertAndSend("/topic/news", resultado);
            } else {
                System.out.println("Aviso: Resultado nulo ao buscar por NameId");
            }
        } else {
            System.out.println("Aviso: Operação não encontrada");
        }
    }
}