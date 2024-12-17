package com.api.nodemcu.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

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

    @GetMapping("/changeColor/fonte")
    @ResponseBody
    @Transactional
    public void changeColorControle2(@RequestParam String op, @RequestParam String status) {
        OperationModel operation = operationRepository.findByName(op);
        try {
            nodemcuRepository.updateStateByNameId(status, operation.getId());
            messagingTemplate.convertAndSend(
                    "/user/" + operation.getName() + "/news",
                    status);
        } catch (InvalidDataAccessApiUsageException e) {
            throw new RuntimeException(e);
        }
    }
}