package com.api.nodemcu.model;

import java.util.Date;

import lombok.Data;

public class GeralNodemcuDTO {
    private int id;

    private OperationDTO nameId; 

    private Date data;

    private Integer count;

    private Integer firtlastTC;

    private String state;

    private Integer currentTC;

    private Integer analise;

    private Integer time_excess;

    private Integer maintenance;

    private Integer secondtlastTC;

    private Integer ajuda;

    private Integer thirdlastTC;

    private Integer shortestTC;

    private Integer qtdetcexcedido;

    private Integer tcmedio;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public OperationDTO getNameId() {
        return nameId;
    }

    public void setNameId(OperationDTO nameId) {
        this.nameId = nameId;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public Integer getFirtlastTC() {
        return firtlastTC;
    }

    public void setFirtlastTC(Integer firtlastTC) {
        this.firtlastTC = firtlastTC;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Integer getCurrentTC() {
        return currentTC;
    }

    public void setCurrentTC(Integer currentTC) {
        this.currentTC = currentTC;
    }

    public Integer getAnalise() {
        return analise;
    }

    public void setAnalise(Integer analise) {
        this.analise = analise;
    }

    public Integer getTime_excess() {
        return time_excess;
    }

    public void setTime_excess(Integer time_excess) {
        this.time_excess = time_excess;
    }

    public Integer getMaintenance() {
        return maintenance;
    }

    public void setMaintenance(Integer maintenance) {
        this.maintenance = maintenance;
    }

    public Integer getSecondtlastTC() {
        return secondtlastTC;
    }

    public void setSecondtlastTC(Integer secondtlastTC) {
        this.secondtlastTC = secondtlastTC;
    }

    public Integer getAjuda() {
        return ajuda;
    }

    public void setAjuda(Integer ajuda) {
        this.ajuda = ajuda;
    }

    public Integer getThirdlastTC() {
        return thirdlastTC;
    }

    public void setThirdlastTC(Integer thirdlastTC) {
        this.thirdlastTC = thirdlastTC;
    }

    public Integer getShortestTC() {
        return shortestTC;
    }

    public void setShortestTC(Integer shortestTC) {
        this.shortestTC = shortestTC;
    }

    public Integer getQtdetcexcedido() {
        return qtdetcexcedido;
    }

    public void setQtdetcexcedido(Integer qtdetcexcedido) {
        this.qtdetcexcedido = qtdetcexcedido;
    }

    public Integer getTcmedio() {
        return tcmedio;
    }

    public void setTcmedio(Integer tcmedio) {
        this.tcmedio = tcmedio;
    }

    
    
}