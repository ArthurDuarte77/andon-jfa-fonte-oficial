package com.api.nodemcu.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
// @Data
@Table(name = "realizadohoraria")
public class RealizadoHorariaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    private Integer horas7;
    private Integer horas8;
    private Integer horas9;
    private Integer horas10;
    private Integer horas11;
    private Integer horas12;
    private Integer horas13;
    private Integer horas14;
    private Integer horas15;
    private Integer horas16;
    private Integer horas17;
    
    public Integer getId() {
        return id;
    }
    public void setId(Integer id) {
        this.id = id;
    }
    public Integer getHoras7() {
        return horas7;
    }
    public void setHoras7(Integer horas7) {
        this.horas7 = horas7;
    }
    public Integer getHoras8() {
        return horas8;
    }
    public void setHoras8(Integer horas8) {
        this.horas8 = horas8;
    }
    public Integer getHoras9() {
        return horas9;
    }
    public void setHoras9(Integer horas9) {
        this.horas9 = horas9;
    }
    public Integer getHoras10() {
        return horas10;
    }
    public void setHoras10(Integer horas10) {
        this.horas10 = horas10;
    }
    public Integer getHoras11() {
        return horas11;
    }
    public void setHoras11(Integer horas11) {
        this.horas11 = horas11;
    }
    public Integer getHoras12() {
        return horas12;
    }
    public void setHoras12(Integer horas12) {
        this.horas12 = horas12;
    }
    public Integer getHoras13() {
        return horas13;
    }
    public void setHoras13(Integer horas13) {
        this.horas13 = horas13;
    }
    public Integer getHoras14() {
        return horas14;
    }
    public void setHoras14(Integer horas14) {
        this.horas14 = horas14;
    }
    public Integer getHoras15() {
        return horas15;
    }
    public void setHoras15(Integer horas15) {
        this.horas15 = horas15;
    }
    public Integer getHoras16() {
        return horas16;
    }
    public void setHoras16(Integer horas16) {
        this.horas16 = horas16;
    }
    public Integer getHoras17() {
        return horas17;
    }
    public void setHoras17(Integer horas17) {
        this.horas17 = horas17;
    }


}
