import { Main } from './../../module/main';
import { DialogRef } from '@angular/cdk/dialog';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Modelo } from 'src/app/module/modelo';
import { Nodemcu } from 'src/app/module/nodemcu';
import { Minutos, Realizado } from 'src/app/module/realizado';
import { MainService } from 'src/app/service/main.service';
import { ModeloService } from 'src/app/service/modelo.service';
import { NodemcuService } from 'src/app/service/nodemcu.service';
import { DialogMetaComponent } from 'src/app/shared/dialog-meta/dialog-meta.component';
import { DialogPauseComponent } from 'src/app/shared/dialog-pause/dialog-pause.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
  private nodemcuService: NodemcuService,
  public dialog: MatDialog,
  private mainService: MainService,
  private modeloService: ModeloService
  ) {}

  impostoInterval: any;
  realizadoInterval: any;
  isForecasted: boolean = false;
  currentDate = new Date();
  currentModel!: Modelo;
  dayOfWeek: Date = new Date();
  graphData: any[] = [];
  graphCounts: number[] = [];
  producedQuantity: number = 0;
  imposto: number = 0;
  averageCycleTime: number = 0;
  hourlyAverage: number = 0;
  nodeMcus: Nodemcu[] = [];
  date: any;
  op: string = '';
  counts: number[] = [];
  targetCycleTime: number = 0;
  forecastedQuantity: number = 0;
  shiftTime: number = 8.66;
  minutos8: number = 0;
  minutos9: number = 0;
  minutos10: number = 0;
  minutos11: number = 0;
  minutos12: number = 0;
  minutos13: number = 0;
  minutos14: number = 0;
  minutos15: number = 0;
  minutos16: number = 0;
  minutos17: number = 0;

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

  currentTime: any;
  effectiveTimeInminutos: any;
  targetCalculation = 0;
  proportionalDiscount: number = 0;
  isInitialized: boolean = false;
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
  currentHour: any;
  targetPerMinute: any = 0;
  dialogReference: any;
  producedAt7 = 0;

  ngOnDestroy(): void {
    clearInterval(this.realizadoInterval);
  }

  ngOnInit(): void {
    this.isInitialized = true;
    this.modeloService.getAll().subscribe((res) => {
      res.forEach((item) => {
        if (item.is_current == true) {
          this.currentModel = item;
        }
      });
      if (this.currentModel == undefined) {
        this.modeloService.changeIsCurrent('STORM 120A', true);
      }
    });
    window.onload = () => {
      this.isInitialized = true;
    };
    for (let index = 0; index < 17; index++) {
      this.currentCycleTimes[index] = 0;
    }

    this.nodemcuService.getAll().subscribe((res) => {
      this.nodeMcus = res;
      this.nodeMcus.forEach((item) => {
        this.counts[item.id!] = 0;
      });
      this.mainService.getAllMain().subscribe((res: Main[]) => {
        this.imposto = res[0].imposto;
        this.shiftTime = res[0].shiftTime;
        this.op = res[0].op;
      });
    });
    this.nodemcuService.getAllRealizado().subscribe((res) => {
      this.horas = res[0];
    });
    this.impostoInterval = setInterval(() => {
      this.targetInterval();
      this.handleBreaks();
    }, 1000);
    this.realizadoInterval = setInterval(() => {
      this.realizedInterval();
    }, 5000);
    setInterval(() => {
      if (this.currentHour == 17 && new Date().getMinutes() == 0) {
        clearInterval(this.impostoInterval);
        clearInterval(this.realizadoInterval);
      } else if (
      this.currentHour == 7 &&
      new Date().getMinutes() == 0 &&
      new Date().getSeconds() == 0
      ) {
        this.impostoInterval = setInterval(() => {
          this.targetInterval();
        }, 1000);

        this.realizadoInterval = setInterval(() => {
          this.realizedInterval();
        }, 5000);
      }
    }, 1000);
  }

  realizedInterval() {
    this.nodemcuService.getAllRealizado().subscribe((res) => {
      this.horas = res[0];
    });
    this.mainService.getAllMain().subscribe((res) => {
      this.imposto = res[0].imposto;
      this.shiftTime = res[0].shiftTime;
      this.op = res[0].op;
    });
    this.modeloService.getAll().subscribe((res) => {
      res.forEach((item) => {
        if (item.is_current == true) {
          this.currentModel = item;
        }
      });
    });
    this.nodeMcus.forEach((item) => {
      if (item.nameId.pausa == true) {
        if (!this.dialog.openDialogs.length) {
          this.dialogReference = this.dialog.open(DialogPauseComponent, {
            width: '900px',
            height: '400px',
          });
        }
      } else {
        if (this.dialog.openDialogs.length) {
          this.dialogReference.close();
        }
      }
    });
  }

  targetInterval() {
    this.targetPerMinute = this.imposto / this.shiftTime / 60;
    this.dayOfWeek = new Date();
    this.currentHour = new Date().getHours();
    this.mainService.getControleRealizadoByDate().subscribe((res) => {
      res.forEach((item) => {
        if (new Date(item.data).getDay() === new Date().getDay()) {
          if (item.data == 7) {
            this.minuteFlags.minutos7 = true;
          } else if (item.data == 8) {
            this.minuteFlags.minutos8 = true;
          } else if (item.data == 9) {
            this.minuteFlags.minutos9 = true;
          } else if (item.data == 10) {
            this.minuteFlags.minutos10 = true;
          } else if (item.data == 11) {
            this.minuteFlags.minutos11 = true;
          } else if (item.data == 12) {
            this.minuteFlags.minutos12 = true;
          } else if (item.data == 13) {
            this.minuteFlags.minutos14 = true;
          } else if (item.data == 14) {
            this.minuteFlags.minutos13 = true;
          } else if (item.data == 15) {
            this.minuteFlags.minutos15 = true;
          } else if (item.data == 16) {
            this.minuteFlags.minutos16 = true;
          } else if (item.data == 17) {
            this.minuteFlags.minutos17 = true;
          }
        }
      });
      if (this.currentHour == 7) {
        this.minutos8 = new Date().getMinutes();
      } else if (this.currentHour == 8) {
        this.minutos8 = 60;
        this.minutos9 = new Date().getMinutes();
      } else if (this.currentHour == 9) {
        if (
        this.horas.horas7 <
        this.minutos8 * (this.imposto / this.shiftTime / 60) - 0.5
        ) {
          if (!this.minuteFlags.minutos8) {
            this.openProductionControlDialog(
            this.horas.horas7,
            this.minutos8 * (this.imposto / this.shiftTime / 60) - 0.5,
            this.currentHour - 1
            );
          }
        }
        this.minutos8 = 60;
        this.minutos9 = 60;
        this.minutos10 = new Date().getMinutes();
      } else if (this.currentHour == 10) {
        if (
        this.horas.horas8 <
        this.minutos9 * (this.imposto / this.shiftTime / 60) - 0.5
        ) {
          if (!this.minuteFlags.minutos9) {
            this.openProductionControlDialog(
            this.horas.horas8,
            this.minutos9 * (this.imposto / this.shiftTime / 60) - 0.5,
            this.currentHour - 1
            );
          }
        }
        this.minutos8 = 60;
        this.minutos9 = 60;
        this.minutos10 = 60;
        this.minutos11 = new Date().getMinutes();
      } else if (this.currentHour == 11) {
        if (
        this.horas.horas9 <
        this.minutos10 * (this.imposto / this.shiftTime / 60) - 0.5
        ) {
          if (!this.minuteFlags.minutos10) {
            this.openProductionControlDialog(
            this.horas.horas9,
            this.minutos10 * (this.imposto / this.shiftTime / 60) - 0.5,
            this.currentHour - 1
            );
          }
        }
        this.minutos8 = 60;
        this.minutos9 = 60;
        this.minutos10 = 60;
        this.minutos11 = 60;
        this.minutos12 = new Date().getMinutes();
      } else if (this.currentHour == 12) {
        if (
        this.horas.horas10 <
        this.minutos11 * (this.imposto / this.shiftTime / 60) - 0.5
        ) {
          if (!this.minuteFlags.minutos11) {
            this.openProductionControlDialog(
            this.horas.horas10,
            this.minutos11 * (this.imposto / this.shiftTime / 60) - 0.5,
            this.currentHour - 1
            );
          }
        }
        this.minutos8 = 60;
        this.minutos9 = 60;
        this.minutos10 = 60;
        this.minutos11 = 60;
        this.minutos12 = 60;
        this.minutos13 = new Date().getMinutes();
      } else if (this.currentHour == 13) {
        if (
        this.horas.horas11 <
        this.minutos12 * (this.imposto / this.shiftTime / 60) - 0.5
        ) {
          if (!this.minuteFlags.minutos12) {
            this.openProductionControlDialog(
            this.horas.horas11,
            this.minutos12 * (this.imposto / this.shiftTime / 60) - 0.5,
            this.currentHour - 1
            );
          }
        }
        this.minutos8 = 60;
        this.minutos9 = 60;
        this.minutos10 = 60;
        this.minutos11 = 60;
        this.minutos12 = 60;
        this.minutos13 = 60;
        this.minutos14 = new Date().getMinutes();
      } else if (this.currentHour == 14) {
        if (
        this.horas.horas12 <
        this.minutos13 * (this.imposto / this.shiftTime / 60) - 0.5
        ) {
          if (!this.minuteFlags.minutos13) {
            this.openProductionControlDialog(
            this.horas.horas12,
            this.minutos13 * (this.imposto / this.shiftTime / 60) - 0.5,
            this.currentHour - 1
            );
          }
        }
        this.minutos8 = 60;
        this.minutos9 = 60;
        this.minutos10 = 60;
        this.minutos11 = 60;
        this.minutos12 = 60;
        this.minutos13 = 60;
        this.minutos14 = 60;
        this.minutos15 = new Date().getMinutes();
      } else if (this.currentHour == 15) {
        if (
        this.horas.horas13 <
        this.minutos14 * (this.imposto / this.shiftTime / 60) - 0.5
        ) {
          if (!this.minuteFlags.minutos14) {
            this.openProductionControlDialog(
            this.horas.horas13,
            this.minutos14 * (this.imposto / this.shiftTime / 60) - 0.5,
            this.currentHour - 1
            );
          }
        }
        this.minutos8 = 60;
        this.minutos9 = 60;
        this.minutos10 = 60;
        this.minutos11 = 60;
        this.minutos12 = 60;
        this.minutos13 = 60;
        this.minutos14 = 60;
        this.minutos15 = 60;
        this.minutos16 = new Date().getMinutes();
      } else if (this.currentHour == 16) {
        if (
        this.horas.horas14 <
        this.minutos15 * (this.imposto / this.shiftTime / 60) - 0.5
        ) {
          if (!this.minuteFlags.minutos15) {
            this.openProductionControlDialog(
            this.horas.horas14,
            this.minutos15 * (this.imposto / this.shiftTime / 60) - 0.5,
            this.currentHour - 1
            );
          }
        }
        this.minutos8 = 60;
        this.minutos9 = 60;
        this.minutos10 = 60;
        this.minutos11 = 60;
        this.minutos12 = 60;
        this.minutos13 = 60;
        this.minutos14 = 60;
        this.minutos15 = 60;
        this.minutos16 = 60;
        this.minutos17 = new Date().getMinutes();
      } else if (this.currentHour == 17) {
        if (
        this.horas.horas15 <
        this.minutos16 * (this.imposto / this.shiftTime / 60) - 0.5
        ) {
          if (!this.minuteFlags.minutos16) {
            this.openProductionControlDialog(
            this.horas.horas15,
            this.minutos16 * (this.imposto / this.shiftTime / 60) - 0.5,
            this.currentHour - 1
            );
          }
        }
        this.minutos8 = 60;
        this.minutos9 = 60;
        this.minutos10 = 60;
        this.minutos11 = 60;
        this.minutos12 = 60;
        this.minutos13 = 60;
        this.minutos14 = 60;
        this.minutos15 = 60;
        this.minutos16 = 60;
        this.minutos17 = 60;
      }
    });

    const currentDate = new Date();
    const newDatehours = new Date(currentDate.getTime() - 7 * 60 * 60 * 1000);
    const hours1 = newDatehours.getHours();
    const minutos1 = newDatehours.getMinutes();
    this.date = hours1 * 60 + minutos1;

    this.effectiveTimeInminutos = this.date;

    const currentTime = String(currentDate.getHours()).padStart(2, '0');
    const minutos = String(currentDate.getMinutes()).padStart(2, '0');

    this.currentTime = `${currentTime}:${minutos}`;
    this.calculateValues();

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
    // if (this.dialog.openDialogs.length > 0) {
      //   return;
      // }
      // const dialogReference = this.dialog.open(DialogControleRealizadoComponent);
      // dialogReference.afterClosed().subscribe((result) => {
        //   if (result.length > 5) {
          //     this.mainService
          //       .postControleRealizado(imposto, producedQuantity, horas, result)
          //       .subscribe((res) => {});
          //   }
          // });
        }

        calculateRealized() {
          this.nodeMcus.forEach((res) => {
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

        calculateValues() {
          if (this.currentTime >= '09:20') {
            this.effectiveTimeInminutos = this.effectiveTimeInminutos - 10;
            this.proportionalDiscount = 10 / (this.targetCycleTime / 60);
          }
          if (this.currentTime >= '12:00') {
            this.effectiveTimeInminutos = this.effectiveTimeInminutos - 60;
            this.proportionalDiscount =
            this.proportionalDiscount + 60 / (this.targetCycleTime / 60);
          }
          if (this.currentTime >= '14:10') {
            this.effectiveTimeInminutos = this.effectiveTimeInminutos - 10;
            this.proportionalDiscount =
            this.proportionalDiscount + 10 / (this.targetCycleTime / 60);
          }
          this.targetCycleTime = 3600 / (this.imposto / this.shiftTime);

          if (this.currentHour < 12 || this.currentHour >= 13) {
            this.forecastedQuantity =
            this.date / (this.targetCycleTime / 60) - this.proportionalDiscount;
          }
          if (this.currentHour >= 17 && this.currentHour < 7) {
            this.forecastedQuantity = this.imposto;
          }

          if (this.isForecasted == false) {
            this.isForecasted = true;
            setTimeout(() => {
              this.forecastedQuantity =
              this.date / (this.targetCycleTime / 60) - this.proportionalDiscount;
            }, 3000);
          }
        }

        parseIntValue(value: string): number {
          return parseInt(value, 0);
        }

        handleBreaks() {
          const now = new Date();
          const currentTime = now.getHours();
          const minutos = now.getMinutes();
          if (new Date().getDay() != 5) {
            if (currentTime === 9 && minutos === 30) {
              this.nodemcuService.pausa(true).subscribe();
            }
            if (currentTime === 9 && minutos === 40) {
              this.nodemcuService.pausa(false).subscribe();
            }
            if (currentTime === 12 && minutos === 0) {
              this.nodemcuService.pausa(true).subscribe();
            }
            if (currentTime === 13 && minutos === 0) {
              this.nodemcuService.pausa(false).subscribe();
            }
            if (currentTime === 15 && minutos === 20) {
              this.nodemcuService.pausa(true).subscribe();
            }
            if (currentTime === 15 && minutos === 30) {
              this.nodemcuService.pausa(false).subscribe();
            }
          } else {
            if (currentTime === 9 && minutos === 30) {
              this.nodemcuService.pausa(true).subscribe();
            }
            if (currentTime === 9 && minutos === 40) {
              this.nodemcuService.pausa(false).subscribe();
            }
            if (currentTime === 12 && minutos === 0) {
              this.nodemcuService.pausa(true).subscribe();
            }
            if (currentTime === 13 && minutos === 0) {
              this.nodemcuService.pausa(false).subscribe();
            }
            if (currentTime === 14 && minutos === 35) {
              this.nodemcuService.pausa(true).subscribe();
            }
            if (currentTime === 14 && minutos === 45) {
              this.nodemcuService.pausa(false).subscribe();
            }
          }
        }

        openDialog() {
          const dialogRef = this.dialog.open(DialogMetaComponent, { width: '30%', height: '70%' });

          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              var newImposto = result.split(',')[0];
              if (newImposto != 0) {
                this.imposto = result.split(',')[0];
                this.mainService
                  .put(this.imposto, this.targetCycleTime, this.shiftTime, this.op)
                  .subscribe();
              }
              this.shiftTime = result.split(',')[1];
              if (this.shiftTime == 0) {
                if (this.dayOfWeek.getDay() == 5) {
                  this.shiftTime = 7.66
                } else {
                  this.shiftTime = 8.66;
                }
                this.mainService
                  .put(this.imposto, this.targetCycleTime, this.shiftTime, this.op)
                  .subscribe();
                this.calculateValues();
              }
              var op = result.split(',')[2]
              if (op != "") {
                this.mainService
                  .put(this.imposto, this.targetCycleTime, this.shiftTime, op)
                  .subscribe();
                this.calculateValues();
              }
            }
          });
        }
      }
