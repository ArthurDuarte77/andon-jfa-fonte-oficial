import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { interval, Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { Main } from '../../module/main';
import { Modelo } from 'src/app/module/modelo';
import { Nodemcu } from 'src/app/module/nodemcu';
import { Minutos, Realizado } from 'src/app/module/realizado';
import { MainService } from 'src/app/service/main.service';
import { ModeloService } from 'src/app/service/modelo.service';
import { NodemcuService } from 'src/app/service/nodemcu.service';
import { DialogMetaComponent } from 'src/app/shared/dialog-meta/dialog-meta.component';
import { DialogPauseComponent } from 'src/app/shared/dialog-pause/dialog-pause.component';

interface Time {
  hours: number;
  minutes: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  // Propriedades
  isForecasted = false;
  currentDate = new Date();
  currentModel: Modelo = {
    id: 0,
    modelo: '',
    realizado: 0,
    tempo: 0,
    is_current: null
  }
  dayOfWeek = new Date();
  graphData: any[] = [];
  graphCounts: number[] = [];
  producedQuantity = 0;
  imposto = 0;
  averageCycleTime = 0;
  hourlyAverage = 0;
  nodeMcus: Nodemcu[] = [];
  date?: number;
  op = '';
  counts: number[] = [];
  targetCycleTime = 0;
  forecastedQuantity = 0;
  shiftTime = 7.66;
  minuteFlags: Minutos = {
    minutos7: false,
    minutos8: false,
    minutos9: false,
    minutos10: false,
    minutos11: false,
    minutos12: false,
    minutos13: false,
    minutos14: false,
    minutos15: false,
    minutos16: false,
    minutos17: false,
  };
  currentTime: string = ""
  effectiveTimeInMinutos: number = 0;
  targetCalculation = 0;
  proportionalDiscount = 0;
  isInitialized = false;
  currentCycleTimes: number[] = [];
  lastCycleTimes: number[] = [];
  horas: Realizado = {
    id: 0,
    horas7: 0,
    horas8: 0,
    horas9: 0,
    horas10: 0,
    horas11: 0,
    horas12: 0,
    horas13: 0,
    horas14: 0,
    horas15: 0,
    horas16: 0,
    horas17: 0,
    nameId: {
      id: 0,
      name: '',
      ocupado: false,
      pausa: false,
      analise: false,
    },
  };
  currentHour?: number;
  targetPerMinute = 0;
  dialogReference?: MatDialogRef<DialogPauseComponent>;
  producedAt7 = 0;

  private impostoIntervalSubscription?: Subscription;
  private realizadoIntervalSubscription?: Subscription;
  private readonly oneSecondInterval = interval(1000);
  private readonly fiveSecondInterval = interval(5000);

  constructor(
    private nodemcuService: NodemcuService,
    public dialog: MatDialog,
    private mainService: MainService,
    private modeloService: ModeloService
  ) {}

  // Métodos de Ciclo de Vida
  ngOnInit(): void {
    this.isInitialized = true;
    this.loadCurrentModel();
    this.initializeCycleTimes();
    this.loadInitialData();
    this.setupIntervals();
    this.handleEndOfDay();

      window.onload = () => {
        this.isInitialized = true;
      };
  }

  ngOnDestroy(): void {
    this.impostoIntervalSubscription?.unsubscribe();
    this.realizadoIntervalSubscription?.unsubscribe();
  }

  // Métodos de Inicialização e Carregamento de Dados
  private loadCurrentModel(): void {
    this.modeloService.getAll().subscribe((res) => {
      this.currentModel = res.find((item) => item.is_current)!;
      if (!this.currentModel) {
        this.modeloService.changeIsCurrent('STORM 120A', true);
      }
    });
  }

  private initializeCycleTimes(): void {
    for (let index = 0; index < 17; index++) {
      this.currentCycleTimes[index] = 0;
    }
  }

  private loadInitialData(): void {
    this.nodemcuService.getAll().subscribe((nodeMcus) => {
      this.nodeMcus = nodeMcus;
      this.counts = nodeMcus.reduce(
        (acc: any, item: any) => ({ ...acc, [item.id!]: 0 }),
        {}
      );
      this.loadMainData();
    });
  }

  private loadMainData(): void {
      this.mainService.getAllMain().subscribe((mainData) => {
        if (mainData.length > 0) {
          this.imposto = mainData[0].imposto;
          this.shiftTime = mainData[0].shiftTime;
          this.op = mainData[0].op;
        }
        this.loadRealizado();
      });
  }

   private loadRealizado() {
        this.nodemcuService.getAllRealizado().subscribe((res) => {
            if (res && res.length > 0) {
                this.horas = res[0];
            }
        });
   }

    private setupIntervals(): void {
        this.impostoIntervalSubscription = this.oneSecondInterval
        .subscribe(() => {
            this.targetInterval();
             this.handleBreaks();
         });

         this.realizadoIntervalSubscription = this.fiveSecondInterval.subscribe(() => {
             this.realizedInterval();
         });
    }


    private handleEndOfDay(): void {
        interval(1000)
          .subscribe(() => {
              const now = new Date();
              const currentHour = now.getHours();
              const currentMinutes = now.getMinutes();
                if (currentHour === 17 && currentMinutes === 0) {
                    this.impostoIntervalSubscription?.unsubscribe();
                    this.realizadoIntervalSubscription?.unsubscribe();
                } else if (
                    currentHour === 7 &&
                    currentMinutes === 0 &&
                    now.getSeconds() === 0
                ) {
                    this.setupIntervals();
                 }
          });
    }

  // Métodos de Lógica de Negócio
    private realizedInterval(): void {
      this.loadRealizado();
      this.loadMainData();
      this.loadCurrentModel();
      this.handleDialogPause();
    }

  private handleDialogPause(): void {
      this.nodeMcus.forEach(node => {
        if (node.nameId.pausa) {
            if (!this.dialog.openDialogs.length) {
                this.dialogReference = this.dialog.open(DialogPauseComponent, {
                    width: '900px',
                    height: '400px'
                });
            }
        } else if (this.dialog.openDialogs.length) {
            this.dialogReference?.close();
        }
      });
  }

    private targetInterval(): void {
        this.targetPerMinute = parseInt((this.imposto / this.shiftTime / 60).toFixed(0));
        this.dayOfWeek = new Date();
        this.currentHour = new Date().getHours();
        this.resetMinuteFlags();
        this.checkAndOpenProductionControlDialog();
        this.calculateTime();
        this.calculateValues();
        this.fetchNodemcuDataAndCalculateAverages();
    }


    private resetMinuteFlags(): void {
        this.mainService.getControleRealizadoByDate().subscribe((res) => {
           res.forEach((item) => {
             if (new Date(item.data).getDay() === new Date().getDay()) {
                this.minuteFlags[`minutos${item.data}` as keyof Minutos] = true;
              }
          });
    });
   }

    private checkAndOpenProductionControlDialog() {
        const currentMinutes = new Date().getMinutes();

        this.handleProductionControlDialog(7, 8, currentMinutes);
        this.handleProductionControlDialog(8, 9, currentMinutes);
        this.handleProductionControlDialog(9, 10, currentMinutes);
        this.handleProductionControlDialog(10, 11, currentMinutes);
        this.handleProductionControlDialog(11, 12, currentMinutes);
        this.handleProductionControlDialog(12, 13, currentMinutes);
        this.handleProductionControlDialog(13, 14, currentMinutes);
        this.handleProductionControlDialog(14, 15, currentMinutes);
        this.handleProductionControlDialog(15, 16, currentMinutes);
        this.handleProductionControlDialog(16, 17, currentMinutes);
        this.handleProductionControlDialog(17, 18, currentMinutes);
    }

  private handleProductionControlDialog(currentHour: number, nextHour: number, currentMinutes: number): void {
    if (this.currentHour === currentHour) {
      const minutes = this.getMinutesForHour(currentHour, nextHour, currentMinutes);
      const currentHourKey = `horas${currentHour}` as keyof Realizado;
      if (minutes != 0 && this.horas) {
          const targetForHour = minutes * (this.imposto / this.shiftTime / 60) - 0.5;
            const producedForHour = this.horas[currentHourKey];
            if (typeof producedForHour === 'number' && producedForHour < targetForHour) {
                if (!this.minuteFlags[`minutos${nextHour}` as keyof Minutos]) {
                     this.openProductionControlDialog(producedForHour, targetForHour, currentHour);
               }
           }
    }
  }
}

  getMinutesForHour(currentHour: number, nextHour: number, currentMinutes: number): number {
    currentHour = new Date().getHours()
    if (currentHour === 7) return currentMinutes;
    if (currentHour === 8) return 60;
    if (currentHour === 9) return currentMinutes;
    if (currentHour === 10) return currentMinutes;
    if (currentHour === 11) return currentMinutes;
    if (currentHour === 12) return currentMinutes;
    if (currentHour === 13) return currentMinutes;
    if (currentHour === 14) return currentMinutes;
    if (currentHour === 15) return currentMinutes;
    if (currentHour === 16) return currentMinutes;
    if (currentHour === 17) return currentMinutes
    return 0;
  }


    private calculateTime(): void {
      const currentDate = new Date();
      const newDatehours = new Date(currentDate.getTime() - 7 * 60 * 60 * 1000);
      const hours = newDatehours.getHours();
      const minutes = newDatehours.getMinutes();
      this.date = hours * 60 + minutes;
      this.effectiveTimeInMinutos = this.date;
      const formattedHours = String(currentDate.getHours()).padStart(2, '0');
      const formattedMinutes = String(currentDate.getMinutes()).padStart(2, '0');
      this.currentTime = `${formattedHours}:${formattedMinutes}`;
    }

  private fetchNodemcuDataAndCalculateAverages(): void {
      this.nodemcuService.getAll().subscribe((res) => {
            this.nodeMcus = res;
            this.hourlyAverage = 0;
            this.averageCycleTime = 0;
            this.calculateRealized();
      });
    this.currentDate = new Date();
   }

  openProductionControlDialog(
        producedQuantity: number,
        imposto: number,
        horas: number
  ) {
        // Implemente a lógica do diálogo de controle de produção
  }

    calculateRealized(): void {
        this.nodeMcus.forEach(res => {
            this.averageCycleTime += res.tcmedio;
            this.hourlyAverage += res.tcmedio;
            if (res.nameId.name == '160') {
              this.producedQuantity = res.count;
            }
        });
        this.averageCycleTime = this.averageCycleTime / this.nodeMcus.length - 1;
        this.hourlyAverage =
          (this.hourlyAverage / this.nodeMcus.length - 1) / 8.5;
    }

    calculateValues(): void {
      if (this.currentTime && this.effectiveTimeInMinutos ) {
        if (this.currentTime >= '09:20') {
          this.effectiveTimeInMinutos -= 10;
          this.proportionalDiscount = 10 / (this.targetCycleTime / 60);
        }
        if (this.currentTime >= '12:00') {
          this.effectiveTimeInMinutos -= 60;
          this.proportionalDiscount += 60 / (this.targetCycleTime / 60);
        }
        if (this.currentTime >= '14:10') {
          this.effectiveTimeInMinutos -= 10;
          this.proportionalDiscount += 10 / (this.targetCycleTime / 60);
        }
          this.targetCycleTime = 3600 / (this.imposto / this.shiftTime);
          if (this.currentHour && (this.currentHour < 12 || this.currentHour >= 13)) {
              this.forecastedQuantity =
              this.date! / (this.targetCycleTime / 60) - this.proportionalDiscount;
           }
          if (this.currentHour && (this.currentHour >= 17 || this.currentHour < 7)) {
             this.forecastedQuantity = this.imposto;
          }
          if (!this.isForecasted) {
             this.isForecasted = true;
             setTimeout(() => {
                this.forecastedQuantity = this.date! / (this.targetCycleTime / 60) - this.proportionalDiscount;
             }, 3000);
          }
      }
    }


  parseIntValue(value: string): number {
    return parseInt(value, 0);
  }


  handleBreaks(): void {
    const now = new Date();
    const currentTime = now.getHours();
    const minutos = now.getMinutes();
      if (new Date().getDay() !== 5) {
         this.handleBreakLogic(currentTime, minutos, 9, 30, true);
         this.handleBreakLogic(currentTime, minutos, 9, 40, false);
         this.handleBreakLogic(currentTime, minutos, 12, 0, true);
         this.handleBreakLogic(currentTime, minutos, 13, 0, false);
         this.handleBreakLogic(currentTime, minutos, 15, 20, true);
         this.handleBreakLogic(currentTime, minutos, 15, 30, false);
    } else {
         this.handleBreakLogic(currentTime, minutos, 9, 30, true);
        this.handleBreakLogic(currentTime, minutos, 9, 40, false);
        this.handleBreakLogic(currentTime, minutos, 12, 0, true);
        this.handleBreakLogic(currentTime, minutos, 13, 0, false);
        this.handleBreakLogic(currentTime, minutos, 14, 35, true);
         this.handleBreakLogic(currentTime, minutos, 14, 45, false);
    }
  }

    private handleBreakLogic(currentTime: number, currentMinutes: number, breakHour: number, breakMinute: number, pausa: boolean): void {
        if (currentTime === breakHour && currentMinutes === breakMinute) {
           this.nodemcuService.pausa(pausa).subscribe();
        }
    }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogMetaComponent, {
      width: '30%',
      height: '70%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const [newImposto, newShiftTime, newOp] = result.split(',');
          if (newImposto !== '0' ) {
            this.imposto = parseInt(newImposto);
                this.updateMainData(this.imposto, this.targetCycleTime, this.shiftTime, this.op);
            }
         this.shiftTime =  parseFloat(newShiftTime);
            if (this.shiftTime === 0) {
                this.shiftTime = this.dayOfWeek.getDay() === 5 ? 7.66 : 7.66;
                this.updateMainData(this.imposto, this.targetCycleTime, this.shiftTime, this.op);
        }
       if (newOp !== '') {
                this.op = newOp;
             this.updateMainData(this.imposto, this.targetCycleTime, this.shiftTime, this.op);
            }
        this.calculateValues();
        }
    });
  }
 private updateMainData(imposto:number, targetCycleTime:number, shiftTime:number, op:string): void{
    this.mainService.put(imposto, targetCycleTime, shiftTime, op)
    .subscribe();
 }
}
