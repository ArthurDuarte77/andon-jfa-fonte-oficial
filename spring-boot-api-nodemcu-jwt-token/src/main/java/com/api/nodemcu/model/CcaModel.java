package com.api.nodemcu.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
// @Data
@Table(name = "cca")
public class CcaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Float min;
    private Float max;
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Float getMin() {
        return min;
    }
    public void setMin(Float min) {
        this.min = min;
    }
    public Float getMax() {
        return max;
    }
    public void setMax(Float max) {
        this.max = max;
    }    

}
