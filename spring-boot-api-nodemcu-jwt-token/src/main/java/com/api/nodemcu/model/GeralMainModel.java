package com.api.nodemcu.model;
import java.util.Date;
import java.util.TimeZone;

import jakarta.persistence.*;
import lombok.Data;

@Entity
// @Data
@Table(name="geral_main")
public class GeralMainModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    private Date data;

    private int imposto;

    private Float TCimposto;

    private Float shiftTime;

    private String op;

    @PrePersist
    protected void prePersist() {
        if (this.data == null) {
            TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
            data = new Date();
        }
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public int getImposto() {
        return imposto;
    }

    public void setImposto(int imposto) {
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
