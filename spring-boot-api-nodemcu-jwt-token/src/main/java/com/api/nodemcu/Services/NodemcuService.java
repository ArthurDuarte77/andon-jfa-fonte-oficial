package com.api.nodemcu.Services;

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
import org.springframework.stereotype.Service;

import com.api.nodemcu.controllers.ContadorController;
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

@Service
public class NodemcuService {
    private final NodemcuRepository repository;
    private final OperationRepository operationRepository;
    private final MainRepostory mainRepostory;
    private final ControleGeralRepository controleGeralRepository;
    private final RealizadoHorariaRepository realizadoHorariaRepository;
    private final RealizadoHorariaTabletRepository realizadoHorariaTabletRepository;
    private final ContadorController contadorController;
    private final FontesRepository fontesRepository;
    private final GeralMainRepository geralMainRepository;
    private final GeralNodemcuRepository geralNodemcuRepository;
    private final GeralRealizadoHorariaRepository geralRealizadoHorariaRepository;
    private final GeralRealizadoHorariaTabletRepository geralRealizadoHorariaTabletRepository;
    private final GeralCicloRepository geralCicloRepository;

    private final ScheduledExecutorService scheduler;
    private boolean zerouDados = false;

    @Autowired
    public NodemcuService(NodemcuRepository repository, OperationRepository operationRepository,
            MainRepostory mainRepostory,
            ControleGeralRepository controleGeralRepository, RealizadoHorariaRepository realizadoHorariaRepository,
            RealizadoHorariaTabletRepository realizadoHorariaTabletRepository, ContadorController contadorController,
            FontesRepository fontesRepository, GeralMainRepository geralMainRepository,
            GeralNodemcuRepository geralNodemcuRepository,
            GeralRealizadoHorariaRepository geralRealizadoHorariaRepository,
            GeralRealizadoHorariaTabletRepository geralRealizadoHorariaTabletRepository,
            GeralCicloRepository geralCicloRepository) {
        this.repository = repository;
        this.operationRepository = operationRepository;
        this.mainRepostory = mainRepostory;
        this.controleGeralRepository = controleGeralRepository;
        this.realizadoHorariaRepository = realizadoHorariaRepository;
        this.realizadoHorariaTabletRepository = realizadoHorariaTabletRepository;
        this.contadorController = contadorController;
        this.fontesRepository = fontesRepository;
        this.geralMainRepository = geralMainRepository;
        this.geralNodemcuRepository = geralNodemcuRepository;
        this.geralRealizadoHorariaRepository = geralRealizadoHorariaRepository;
        this.geralRealizadoHorariaTabletRepository = geralRealizadoHorariaTabletRepository;
        this.geralCicloRepository = geralCicloRepository;

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
        scheduler.scheduleAtFixedRate(task, 0, 1, TimeUnit.HOURS);
    }

    public List<NodemcuModel> listAll() {
        return repository.findAll();
    }

    public NodemcuModel findByName(String name) {
        OperationModel operation = operationRepository.findByName(name);
        return repository.findByNameId(operation);
    }

    public void addTimeExcess(String name) {
        OperationModel operation = operationRepository.findByName(name);
        NodemcuModel nodemcu = repository.findByNameId(operation);
        nodemcu.setState("piscar");
        nodemcu.setTime_excess(nodemcu.getTime_excess() + 1);
        repository.save((nodemcu));
    }

    public void addAjuda(String name) {
        OperationModel operation = operationRepository.findByName(name);
        NodemcuModel nodemcu = repository.findByNameId(operation);
        nodemcu.setState("piscar_azul");
        nodemcu.setAjuda(nodemcu.getAjuda() + 1);
        repository.save((nodemcu));
    }

    public NodemcuModel save(NodemcuModel device) {
        return repository.save(device);
    }

    @Transactional
    public NodemcuModel update(String name, NodemcuModel nodemcuUpdates)
            throws IOException, InterruptedException {
        OperationModel operation = operationRepository.findByName(name);
        NodemcuModel device = repository.findByNameId(operation);

        if (device == null) {
            return repository.save(nodemcuUpdates);
        }

        saveGeralCiclo(nodemcuUpdates, operation);

        updateTcHistory(device, nodemcuUpdates);

        updateTcExceeded(device, nodemcuUpdates);

        
        device.setTcmedio((device.getTcmedio() + nodemcuUpdates.getCurrentTC()) / 2);
        device.setCount(nodemcuUpdates.getCount());
        device.setState(nodemcuUpdates.getState());
        device.setCurrentTC(nodemcuUpdates.getCurrentTC());
        
        if (!device.getMaintenance().equals(nodemcuUpdates.getMaintenance())) {
            device.setMaintenance(nodemcuUpdates.getMaintenance());
        } else {
            try {
                realizadoHorariaTablet(name);
            } catch (Exception e) {
                throw new RuntimeException("Error saving device to database", e);
            }
        }
        
        NodemcuModel savedDevice = repository.save(device);
        if (savedDevice != null) {
            if (Integer.parseInt(nodemcuUpdates.getNameId().getName()) == 160) {
                countFontes();  
                realizadoHoraria();
            }
        }

        return device;
    }

    private void countFontes() {
        FontesModel fonteAtual = fontesRepository.findAll().stream()
                .filter(FontesModel::getIs_current)
                .findFirst()
                .orElse(null);
        if (fonteAtual != null) {
            fonteAtual.setRealizado(fonteAtual.getRealizado() + 1);
            fontesRepository.save(fonteAtual);
        }
    }

    private void saveGeralCiclo(NodemcuModel nodemcuUpdates, OperationModel operation) {
        GeralCiclosModel geralCiclo = new GeralCiclosModel();
        geralCiclo.setCount(nodemcuUpdates.getCount());
        geralCiclo.setData(new Date());
        geralCiclo.setNameId(operation);
        geralCiclo.setTime(nodemcuUpdates.getCurrentTC());
        geralCicloRepository.save(geralCiclo);
    }

    private void updateTcHistory(NodemcuModel device, NodemcuModel nodemcuUpdates) {
        device.setThirdlastTC(device.getSecondtlastTC());
        device.setSecondtlastTC(device.getFirtlastTC());
        device.setFirtlastTC(nodemcuUpdates.getCurrentTC());
    }

    private void updateTcExceeded(NodemcuModel device, NodemcuModel nodemcuUpdates) {
        Float tcimposto = mainRepostory.findById(1).get().getTCimposto();
        if (nodemcuUpdates.getNameId().getName().equals("100") || nodemcuUpdates.getNameId().getName().equals("110")
                || nodemcuUpdates.getNameId().getName().equals("080")
                || nodemcuUpdates.getNameId().getName().equals("090")) {
            tcimposto = 180F;
        }
        if (device.getShortestTC() > nodemcuUpdates.getShortestTC() && nodemcuUpdates.getShortestTC() > 10) {
            device.setShortestTC(nodemcuUpdates.getShortestTC());
        } else if (tcimposto.intValue() < nodemcuUpdates.getCurrentTC()) {
            device.setQtdetcexcedido(device.getQtdetcexcedido() + 1);
        }
    }

    @Transactional
    public void updateState(String name, String state) {
        OperationModel operation = operationRepository.findByName(name);
        if (state.equals("azul")) {
            state = "verde";
        }
        repository.updateStateByNameId(state, operation.getId());
    }

    private void realizadoHoraria() {
        Date now = new Date();
        int currentHour = getHour(now);
        Optional<RealizadoHorariaModel> realizado = realizadoHorariaRepository.findById(1);
        if (!realizado.isPresent()) {
            return;
        }
        int hour;
        switch (currentHour) {
            case 7:
                hour = realizado.get().getHoras7();
                realizado.get().setHoras7(hour + 1);
                break;
            case 8:
                hour = realizado.get().getHoras8();
                realizado.get().setHoras8(hour + 1);
                break;
            case 9:
                hour = realizado.get().getHoras9();
                realizado.get().setHoras9(hour + 1);
                break;
            case 10:
                hour = realizado.get().getHoras10();
                realizado.get().setHoras10(hour + 1);
                break;
            case 11:
                hour = realizado.get().getHoras11();
                realizado.get().setHoras11(hour + 1);
                break;
            case 12:
                hour = realizado.get().getHoras12();
                realizado.get().setHoras12(hour + 1);
                break;
            case 13:
                hour = realizado.get().getHoras13();
                realizado.get().setHoras13(hour + 1);
                break;
            case 14:
                hour = realizado.get().getHoras14();
                realizado.get().setHoras14(hour + 1);
                break;
            case 15:
                hour = realizado.get().getHoras15();
                realizado.get().setHoras15(hour + 1);
                break;
            case 16:
                hour = realizado.get().getHoras16();
                realizado.get().setHoras16(hour + 1);
                break;
            case 17:
                hour = realizado.get().getHoras17();
                realizado.get().setHoras17(hour + 1);
                break;
            default:
                return;

        }
        realizadoHorariaRepository.save(realizado.get());
        OperationModel operation = operationRepository.findByName("160");
        NodemcuModel device = repository.findByNameId(operation);
        device.setCount(realizadoHorariaRepository.somarTudo());
        repository.save(device);

    }

    private void realizadoHorariaTablet(String name) {
        Date now = new Date();
        int currentHour = getHour(now);
        OperationModel operation = operationRepository.findByName(name);
        RealizadoHorariaTabletModel realizado = realizadoHorariaTabletRepository.findByNameId(operation);
        if (realizado == null) {
            return;
        }
        int hour;
        switch (currentHour) {
            case 7:
                hour = realizado.getHoras7();
                realizado.setHoras7(hour + 1);
                break;
            case 8:
                hour = realizado.getHoras8();
                realizado.setHoras8(hour + 1);
                break;
            case 9:
                hour = realizado.getHoras9();
                realizado.setHoras9(hour + 1);
                break;
            case 10:
                hour = realizado.getHoras10();
                realizado.setHoras10(hour + 1);
                break;
            case 11:
                hour = realizado.getHoras11();
                realizado.setHoras11(hour + 1);
                break;
            case 12:
                hour = realizado.getHoras12();
                realizado.setHoras12(hour + 1);
                break;
            case 13:
                hour = realizado.getHoras13();
                realizado.setHoras13(hour + 1);
                break;
            case 14:
                hour = realizado.getHoras14();
                realizado.setHoras14(hour + 1);
                break;
            case 15:
                hour = realizado.getHoras15();
                realizado.setHoras15(hour + 1);
                break;
            case 16:
                hour = realizado.getHoras16();
                realizado.setHoras16(hour + 1);
                break;
            case 17:
                hour = realizado.getHoras17();
                realizado.setHoras17(hour + 1);
                break;
            default:
                return;
        }
        realizadoHorariaTabletRepository.save(realizado);
        NodemcuModel device = repository.findByNameId(operation);
        device.setCount(realizadoHorariaTabletRepository.somarTudo(realizado.getId()));
        repository.save(device);
    }

    private int getHour(Date date) {
        SimpleDateFormat formatador = new SimpleDateFormat("HH");
        return Integer.parseInt(formatador.format(date));
    }

    @Transactional
    public void updateLocalTC(String name, Integer tempo) {
        OperationModel operation = operationRepository.findByName(name);
        repository.updateLocalTCByNameId(tempo, operation.getId());
    }

    public void resetZerarDados(){
        zerouDados = false;
    }

    public void zerarDados() {
        if (true) {
            try {

                FontesModel fonteAtual = fontesRepository.findAll().stream()
                        .filter(FontesModel::getIs_current)
                        .findFirst()
                        .orElse(null);

                OperationModel operations = operationRepository.findByName("160");
                NodemcuModel nodemcuResultadoGeral = repository.findByNameId(operations);
                Optional<MainModel> main = mainRepostory.findById(1);
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                Date currentDate = new Date();
                String formattedDate = dateFormat.format(currentDate);
                List<ControleGeralModel> controleGeral = controleGeralRepository.findByDataBetween(formattedDate,
                        formattedDate);
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
                if (realizadoHoraria.isPresent()) {
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
                }

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
            } catch (Exception e) {
                e.printStackTrace();
            }
            zerouDados = true;
        }
    }
}