package com.api.nodemcu.controllers;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.nodemcu.model.Contador;
import com.api.nodemcu.model.ControleGeralModel;
import com.api.nodemcu.model.FontesModel;
import com.api.nodemcu.model.GeralCiclosModel;
import com.api.nodemcu.model.GeralMainModel;
import com.api.nodemcu.model.GeralNodemcuModel;
import com.api.nodemcu.model.GeralRealizadoHorariaModel;
import com.api.nodemcu.model.GeralRealizadoHorariaTabletModel;
import com.api.nodemcu.model.MainModel;
import com.api.nodemcu.model.NodemcuModel;
import com.api.nodemcu.model.OperationModel;
import com.api.nodemcu.model.RealizadoHorariaModel;
import com.api.nodemcu.model.RealizadoHorariaTabletModel;
import com.api.nodemcu.repository.ControleGeralRepository;
import com.api.nodemcu.repository.FontesRepository;
import com.api.nodemcu.repository.GeralCicloRepository;
import com.api.nodemcu.repository.GeralMainRepository;
import com.api.nodemcu.repository.GeralNodemcuRepository;
import com.api.nodemcu.repository.GeralRealizadoHorariaRepository;
import com.api.nodemcu.repository.GeralRealizadoHorariaTabletRepository;
import com.api.nodemcu.repository.MainRepostory;
import com.api.nodemcu.repository.NodemcuRepository;
import com.api.nodemcu.repository.OperationRepository;
import com.api.nodemcu.repository.RealizadoHorariaRepository;
import com.api.nodemcu.repository.RealizadoHorariaTabletRepository;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/v1/nodemcu")
public class NodemcuController {

    @Autowired
    private NodemcuRepository repository;

    @Autowired
    private OperationRepository operationRepository;

    @Autowired
    private MainRepostory mainRepostory;

    @Autowired
    ControleGeralRepository controleGeralRepository;

    @Autowired
    private RealizadoHorariaRepository realizadoHorariaRepository;

    @Autowired
    private RealizadoHorariaTabletRepository realizadoHorariaTabletRepository;

    @Autowired
    private ContadorController contadorController;

    @Autowired
    private FontesRepository fontesRepository;

    @Autowired
    private GeralMainRepository geralMainRepository;

    @Autowired
    private GeralNodemcuRepository geralNodemcuRepository;

    @Autowired
    private GeralRealizadoHorariaRepository geralRealizadoHorariaRepository;

    @Autowired
    private GeralRealizadoHorariaTabletRepository geralRealizadoHorariaTabletRepository;

    @Autowired
    private GeralCicloRepository geralCicloRepository;

    boolean state = false;
    Integer anterior = 0;
    boolean isRefugo = false;
    private boolean zerouDados = false;


    private ScheduledExecutorService scheduler;

    public NodemcuController() {
        this.scheduler = Executors.newScheduledThreadPool(1);
        agendarTarefa();
    }

    private void agendarTarefa() {
        Runnable task = () -> {
            Calendar calendar = Calendar.getInstance();
            int hour = calendar.get(Calendar.HOUR_OF_DAY);
            int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
            if (hour >= 20 & hour <= 21 && dayOfWeek >= Calendar.MONDAY && dayOfWeek <= Calendar.FRIDAY) {
                zerarDados();
            }
        };

        // Agende a tarefa para ser executada a cada hora
        scheduler.scheduleAtFixedRate(task, 0, 1, TimeUnit.HOURS);
    }


    @GetMapping()
    public List<NodemcuModel> list() throws java.text.ParseException {
        return repository.findAll();
    }

    @GetMapping("/{name}")
    public NodemcuModel findByName(@PathVariable String name) {
        OperationModel operation = operationRepository.findByName(name);
        NodemcuModel nodemcu = repository.findByNameId(operation);
        return nodemcu;
    }
    @GetMapping("/timeExcess/{name}")
    public void AddTimeExcess(@PathVariable String name){
        OperationModel operation = operationRepository.findByName(name);
        NodemcuModel nodemcu = repository.findByNameId(operation);
        nodemcu.setState("piscar");
        nodemcu.setTime_excess(nodemcu.getTime_excess() + 1);
        repository.save((nodemcu));
    }

    @GetMapping("/zerar")
    public void zerar(){
        zerouDados = false;
        zerarDados();
    }

    @GetMapping("/ajuda/{name}")
    public void AddAjuda(@PathVariable String name){
        OperationModel operation = operationRepository.findByName(name);
        NodemcuModel nodemcu = repository.findByNameId(operation);
        nodemcu.setState("piscar_azul");
        nodemcu.setAjuda(nodemcu.getAjuda() + 1);
        repository.save((nodemcu));
    }

    @PostMapping()
    public NodemcuModel post(@RequestBody NodemcuModel device) {
        repository.save(device);
        return device;
    }
    @Transactional
    @PatchMapping("/{name}")
    public NodemcuModel patch(@PathVariable String name, @RequestBody NodemcuModel nodemcuUpdates)
            throws IOException, InterruptedException {
        OperationModel operation = operationRepository.findByName(name);
        NodemcuModel device = repository.findByNameId(operation);

        
        if (device == null) {
            repository.save(nodemcuUpdates);
            return nodemcuUpdates;
        }

        GeralCiclosModel geralCiclo = new GeralCiclosModel();
        geralCiclo.setCount(nodemcuUpdates.getCount());
        geralCiclo.setData(new Date());
        geralCiclo.setNameId(operation);
        geralCiclo.setTime(nodemcuUpdates.getCurrentTC());
        geralCicloRepository.save(geralCiclo);
        
        device.setThirdlastTC(device.getSecondtlastTC());
        device.setSecondtlastTC(device.getFirtlastTC());
        device.setFirtlastTC(device.getCurrentTC());

        Float tcimposto = mainRepostory.findById(1).get().getTCimposto();
        if(nodemcuUpdates.getNameId().getName().equals("100") || nodemcuUpdates.getNameId().getName().equals("110")|| nodemcuUpdates.getNameId().getName().equals("080")|| nodemcuUpdates.getNameId().getName().equals("090")){
            tcimposto = 180F;
        }

        if (device.getShortestTC() > nodemcuUpdates.getShortestTC() && nodemcuUpdates.getShortestTC() > 10) {
            device.setShortestTC(nodemcuUpdates.getShortestTC());
        } else if (tcimposto.intValue() < nodemcuUpdates.getCurrentTC()) {
            Integer excedido = device.getQtdetcexcedido();
            excedido++;
            device.setQtdetcexcedido(excedido);
        }
        
        Integer media = (device.getTcmedio() + nodemcuUpdates.getCurrentTC()) / 2;
        
        device.setTcmedio(media);
        device.setCount(nodemcuUpdates.getCount());
        device.setState(nodemcuUpdates.getState());
        device.setCurrentTC(nodemcuUpdates.getCurrentTC());
        if (!device.getMaintenance().equals(nodemcuUpdates.getMaintenance())) {
            isRefugo = true;
            device.setMaintenance(nodemcuUpdates.getMaintenance());
        } else {
            isRefugo = false;
            try {
                RealizadoHorariaTablet(name);
            } catch (Exception e) {
                throw new RuntimeException("Erro ao salvar o dispositivo no banco de dados", e);
            }
        }
        
        try {
            NodemcuModel savedDevice = repository.save(device);
            if (savedDevice != null) {
                if (Integer.parseInt(nodemcuUpdates.getNameId().getName()) == 160) {
                    RealizadoHoraria();
                }
            }
            return device;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar o dispositivo no banco de dados", e);
        }
    }
    
    @Transactional
    @GetMapping("/atualizarState/{name}/{state}")
    public void atualizarCor(@PathVariable("name") String name, @PathVariable("state") String state) {
        OperationModel operation = operationRepository.findByName(name);
        if(state.equals("azul")){
            state = "verde";
        }
        repository.updateStateByNameId(state, operation.getId());
    }

    public void RealizadoHoraria() {
        Date agora = new Date();
        SimpleDateFormat formatador = new SimpleDateFormat("HH");
        Integer horaFormatada = Integer.parseInt(formatador.format(agora));
        Optional<RealizadoHorariaModel> realizado = Optional.of(new RealizadoHorariaModel());
        Integer hour = 0;
        realizado = realizadoHorariaRepository.findById(1);
        OperationModel operation = operationRepository.findByName("160");
        NodemcuModel device = repository.findByNameId(operation);
        switch (horaFormatada) {
            case 7:
                hour = realizado.get().getHoras7();
                hour++;
                realizado.get().setHoras7(hour);
                realizadoHorariaRepository.save(realizado.get());
                break;

            case 8:
                hour = realizado.get().getHoras8();
                hour++;
                realizado.get().setHoras8(hour);
                realizadoHorariaRepository.save(realizado.get());
                break;

            case 9:
                hour = realizado.get().getHoras9();
                hour++;
                realizado.get().setHoras9(hour);
                realizadoHorariaRepository.save(realizado.get());
                break;

            case 10:
                hour = realizado.get().getHoras10();
                hour++;
                realizado.get().setHoras10(hour);
                realizadoHorariaRepository.save(realizado.get());
                break;

            case 11:
                hour = realizado.get().getHoras11();
                hour++;
                realizado.get().setHoras11(hour);
                realizadoHorariaRepository.save(realizado.get());
                break;

            case 12:
                hour = realizado.get().getHoras12();
                hour++;
                realizado.get().setHoras12(hour);
                realizadoHorariaRepository.save(realizado.get());
                break;

            case 13:
                hour = realizado.get().getHoras13();
                hour++;
                realizado.get().setHoras13(hour);
                realizadoHorariaRepository.save(realizado.get());
                break;

            case 14:
                hour = realizado.get().getHoras14();
                hour++;
                realizado.get().setHoras14(hour);
                realizadoHorariaRepository.save(realizado.get());
                break;

            case 15:
                hour = realizado.get().getHoras15();
                hour++;
                realizado.get().setHoras15(hour);
                realizadoHorariaRepository.save(realizado.get());
                break;

            case 16:
                hour = realizado.get().getHoras16();
                hour++;
                realizado.get().setHoras16(hour);
                realizadoHorariaRepository.save(realizado.get());
                break;

            case 17:
                hour = realizado.get().getHoras17();
                hour++;
                realizado.get().setHoras17(hour);
                realizadoHorariaRepository.save(realizado.get());
                break;
        }
        device.setCount(realizadoHorariaRepository.somarTudo());
        repository.save(device);
    }

    public void RealizadoHorariaTablet(String name) {
        
        Date agora = new Date();
        SimpleDateFormat formatador = new SimpleDateFormat("HH");
        Integer horaFormatada = Integer.parseInt(formatador.format(agora));
        RealizadoHorariaTabletModel realizado = new RealizadoHorariaTabletModel();
        Integer hour = 0;
        OperationModel operation = operationRepository.findByName(name);
        realizado = realizadoHorariaTabletRepository.findByNameId(operation);
        NodemcuModel device = repository.findByNameId(operation);
        
        switch (horaFormatada) {
            case 7:
                hour = realizado.getHoras7();
                hour++;
                realizado.setHoras7(hour);
                realizadoHorariaTabletRepository.save(realizado);
                break;

            case 8:
                hour = realizado.getHoras8();
                hour++;
                realizado.setHoras8(hour);
                realizadoHorariaTabletRepository.save(realizado);
                break;

            case 9:
                hour = realizado.getHoras9();
                hour++;
                realizado.setHoras9(hour);
                realizadoHorariaTabletRepository.save(realizado);
                break;

            case 10:
                hour = realizado.getHoras10();
                hour++;
                realizado.setHoras10(hour);
                realizadoHorariaTabletRepository.save(realizado);
                break;

            case 11:
                hour = realizado.getHoras11();
                hour++;
                realizado.setHoras11(hour);
                realizadoHorariaTabletRepository.save(realizado);
                break;

            case 12:
                hour = realizado.getHoras12();
                hour++;
                realizado.setHoras12(hour);
                realizadoHorariaTabletRepository.save(realizado);
                break;

            case 13:
                hour = realizado.getHoras13();
                hour++;
                realizado.setHoras13(hour);
                realizadoHorariaTabletRepository.save(realizado);
                break;

            case 14:
                hour = realizado.getHoras14();
                hour++;
                realizado.setHoras14(hour);
                realizadoHorariaTabletRepository.save(realizado);
                break;

            case 15:
                hour = realizado.getHoras15();
                hour++;
                realizado.setHoras15(hour);
                realizadoHorariaTabletRepository.save(realizado);
                break;

            case 16:
                hour = realizado.getHoras16();
                hour++;
                realizado.setHoras16(hour);
                realizadoHorariaTabletRepository.save(realizado);
                break;

            case 17:
                hour = realizado.getHoras17();
                hour++;
                realizado.setHoras17(hour);
                realizadoHorariaTabletRepository.save(realizado);
                break;
        }
         device.setCount(realizadoHorariaTabletRepository.somarTudo(realizado.getId()));
         repository.save(device);
    }

    @Transactional
    @GetMapping("/atualizarTempo/{name}/{tempo}")
    public void iniciarTempo(@PathVariable("name") String name, @PathVariable("tempo") Integer tempo) {
        OperationModel operation = operationRepository.findByName(name);
        repository.updateLocalTCByNameId(tempo, operation.getId());
    }


    public void zerarDados() {
        if (true) {
            System.out.println("entrou");
            try{
                // geralCicloRepository.deleteAll();

                FontesModel fonteAtual = new FontesModel();
                List<FontesModel> fontes = fontesRepository.findAll();

                for(FontesModel fonte: fontes){
                    if (fonte.getIs_current()){
                        fonteAtual = fonte;
                    }
                }
                OperationModel operations = operationRepository.findByName("160");
                NodemcuModel nodemcuResultadoGeral = repository.findByNameId(operations);
                Optional<MainModel> main = mainRepostory.findById(1);
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date currentDate = new Date();
                String formattedDate = dateFormat.format(currentDate);
                List<ControleGeralModel> controleGeral = controleGeralRepository.findByDataBetween(formattedDate, formattedDate);
                controleGeral.get(0).setRealizado(nodemcuResultadoGeral.getCount());
                controleGeral.get(0).setModelo(fonteAtual.getModelo());
                controleGeralRepository.save(controleGeral.get(0));
                GeralMainModel geralMain = new GeralMainModel();
                geralMain.setImposto((int) Math.floor(main.get().getImposto()));
                geralMain.setOp(main.get().getOp());
                geralMain.setShiftTime(main.get().getShiftTime());
                geralMain.setTCimposto(main.get().getTCimposto());
                geralMainRepository.save(geralMain);
                
                Optional<RealizadoHorariaModel> realizadoHoraria = realizadoHorariaRepository.findById(1);
                GeralRealizadoHorariaModel geralRealizado = new GeralRealizadoHorariaModel();
                geralRealizado.setHoras7(realizadoHoraria.get().getHoras7());
                geralRealizado.setHoras8(realizadoHoraria.get().getHoras8());
                geralRealizado.setHoras9(realizadoHoraria.get().getHoras9());
                geralRealizado.setHoras10(realizadoHoraria.get().getHoras10());
                geralRealizado.setHoras11(realizadoHoraria.get().getHoras11());
                geralRealizado.setHoras12(realizadoHoraria.get().getHoras12());
                geralRealizado.setHoras13(realizadoHoraria.get().getHoras13());
                geralRealizado.setHoras14(realizadoHoraria.get().getHoras14());
                geralRealizado.setHoras15(realizadoHoraria.get().getHoras15());
                geralRealizado.setHoras16(realizadoHoraria.get().getHoras16());
                geralRealizado.setHoras17(realizadoHoraria.get().getHoras17());
                geralRealizadoHorariaRepository.save(geralRealizado);

                List<RealizadoHorariaTabletModel> realizadoHorariaTablet = realizadoHorariaTabletRepository.findAll();
                realizadoHorariaTablet.forEach(elemento -> {
                    GeralRealizadoHorariaTabletModel geralRealizadoHorariaTablet = new GeralRealizadoHorariaTabletModel();
                    geralRealizadoHorariaTablet.setNameId(elemento.getNameId());
                    geralRealizadoHorariaTablet.setHoras7(elemento.getHoras7());
                    geralRealizadoHorariaTablet.setHoras8(elemento.getHoras8());
                    geralRealizadoHorariaTablet.setHoras9(elemento.getHoras9());
                    geralRealizadoHorariaTablet.setHoras10(elemento.getHoras10());
                    geralRealizadoHorariaTablet.setHoras11(elemento.getHoras11());
                    geralRealizadoHorariaTablet.setHoras12(elemento.getHoras12());
                    geralRealizadoHorariaTablet.setHoras13(elemento.getHoras13());
                    geralRealizadoHorariaTablet.setHoras14(elemento.getHoras14());
                    geralRealizadoHorariaTablet.setHoras15(elemento.getHoras15());
                    geralRealizadoHorariaTablet.setHoras16(elemento.getHoras16());
                    geralRealizadoHorariaTablet.setHoras17(elemento.getHoras17());
                    geralRealizadoHorariaTabletRepository.save(geralRealizadoHorariaTablet);
                });

                List<OperationModel> operation = operationRepository.findAll();
                operation.forEach(element -> {
                    NodemcuModel nodemcuResultado = repository.findByNameId(element);
                    GeralNodemcuModel nodemcu = new GeralNodemcuModel();
                    nodemcu.setAjuda(nodemcuResultado.getAjuda());
                    nodemcu.setAnalise(nodemcuResultado.getAnalise());
                    nodemcu.setCount(nodemcuResultado.getCount());
                    nodemcu.setCurrentTC(nodemcuResultado.getCurrentTC());
                    nodemcu.setFirtlastTC(nodemcuResultado.getFirtlastTC());
                    nodemcu.setMaintenance(nodemcuResultado.getMaintenance());
                    nodemcu.setNameId(nodemcuResultado.getNameId());
                    nodemcu.setQtdetcexcedido(nodemcuResultado.getQtdetcexcedido());
                    nodemcu.setSecondtlastTC(nodemcuResultado.getSecondtlastTC());
                    nodemcu.setShortestTC(nodemcuResultado.getShortestTC());
                    nodemcu.setState(nodemcuResultado.getState());
                    nodemcu.setTcmedio(nodemcuResultado.getTcmedio());
                    nodemcu.setThirdlastTC(nodemcuResultado.getThirdlastTC());
                    nodemcu.setTime_excess(nodemcuResultado.getTime_excess());
                    geralNodemcuRepository.save(nodemcu);
                });
                
                Optional<RealizadoHorariaModel> realizadoReset = realizadoHorariaRepository.findById(1);
                realizadoReset.ifPresent(reset -> {
                    reset.setHoras12(0);
                    reset.setHoras11(0);
                    reset.setHoras10(0);
                    reset.setHoras9(0);
                    reset.setHoras8(0);
                    reset.setHoras7(0);
                    reset.setHoras13(0);
                    reset.setHoras14(0);
                    reset.setHoras15(0);
                    reset.setHoras17(0);
                    reset.setHoras16(0);
                    realizadoHorariaRepository.save(reset);
                });
                List<NodemcuModel> nodemcuList = repository.findAll();
                for (NodemcuModel nodemcu : nodemcuList) {
                    nodemcu.setCurrentTC(0);
                    nodemcu.setCount(0);
                    nodemcu.setFirtlastTC(0);
                    nodemcu.setSecondtlastTC(0);
                    nodemcu.setThirdlastTC(0);
                    nodemcu.setState("verde");
                    nodemcu.setMaintenance(0);
                    nodemcu.setQtdetcexcedido(0);
                    nodemcu.setTcmedio(0);
                    nodemcu.setShortestTC(9999);
                    nodemcu.setCount(0);
                    contadorController.atualizarTempo(nodemcu.getContador().getId(), false);
                    Contador contador = nodemcu.getContador();
                    contador.setContadorAtual(0);
                    contador.setIs_couting(false);
                    nodemcu.setTime_excess(0);
                    nodemcu.setAnalise(0);
                    nodemcu.setAjuda(0);
                    repository.save(nodemcu);
                }

                List<RealizadoHorariaTabletModel> realizadoList = realizadoHorariaTabletRepository.findAll();
                for (RealizadoHorariaTabletModel realizado : realizadoList) {
                    realizado.setHoras7(0);
                    realizado.setHoras8(0);
                    realizado.setHoras9(0);
                    realizado.setHoras10(0);
                    realizado.setHoras11(0);
                    realizado.setHoras12(0);
                    realizado.setHoras13(0);
                    realizado.setHoras14(0);
                    realizado.setHoras15(0);
                    realizado.setHoras16(0);
                    realizado.setHoras17(0);
                    realizadoHorariaTabletRepository.save(realizado);
                }
                for (OperationModel op : operation) {
                    op.setOcupado(false);
                    operationRepository.save(op);
                }
            }catch (Exception e) {
                e.printStackTrace();
            }
            zerouDados = false;
        } else {
            zerouDados = true;
        }
        }
    }
