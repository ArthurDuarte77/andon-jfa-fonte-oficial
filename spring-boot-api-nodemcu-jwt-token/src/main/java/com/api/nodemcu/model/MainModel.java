package com.api.nodemcu.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
// @Data
@Table(name="main")
public class MainModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    private Float imposto;

    private Float TCimposto;

    private Float shiftTime;

    private String op;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Float getImposto() {
        return imposto;
    }

    public void setImposto(Float imposto) {
        this.imposto = imposto;
    }

    public Float getTCimposto() {
        return TCimposto;
    }

    public void setTCimposto(Float tCimposto) {
        TCimposto = tCimposto;
    }

    public Float getShiftTime() {
        return shiftTime;
    }

    public void setShiftTime(Float shiftTime) {
        this.shiftTime = shiftTime;
    }

    public String getOp() {
        return op;
    }

    public void setOp(String op) {
        this.op = op;
    }

    
}
