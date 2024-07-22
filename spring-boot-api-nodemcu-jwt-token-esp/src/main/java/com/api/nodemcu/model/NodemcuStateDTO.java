package com.api.nodemcu.model;

public class NodemcuStateDTO {
    private String state;

    public NodemcuStateDTO(String state) {
        this.state = state;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
}
