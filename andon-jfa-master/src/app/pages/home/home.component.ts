import { Main } from './../../module/main';
import { DialogRef } from '@angular/cdk/dialog';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Modelo } from 'src/app/module/modelo';
import { Nodemcu } from 'src/app/module/nodemcu';
import { Minutos, Realizado } from 'src/app/module/realizado';
import { MainService } from 'src/app/service/main.service';
import { ModeloService } from 'src/app/service/modelo.service';
import { NodemcuService } from 'src/app/service/nodemcu.service';
import { DialogControleRealizadoComponent } from 'src/app/shared/dialog-controle-realizado/dialog-controle-realizado.component';
import { DialogMetaComponent } from 'src/app/shared/dialog-meta/dialog-meta.component';
import { DialogPauseComponent } from 'src/app/shared/dialog-pause/dialog-pause.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(
    private nodemcuService: NodemcuService,
    public dialog: MatDialog,
    private mainService: MainService,
    private modeloService: ModeloService
  ) { }


  intervaloImposto: any;
  intervaloRealizado: any;
  isPrevisto: boolean = false
  dataAtual = new Date();
  modeloAtual!: Modelo;
  diaDaSemanda: Date = new Date();
  dataGraph: any[] = [];
  countGraph: number[] = [];
  realizado: number = 0;
  imposto: number = 0;
  TCmedioRealizado: number = 0;
  MediaHorarioRealizada: number = 0;
  nodemcu: Nodemcu[] = [];
  date: any;
  op: string = "";
  counting: number[] = []
  TCimpostado: number = 0;
  previsto: number = 0;
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

  minutos: Minutos = {
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

  hours: any;
  effectiveTime: any;
  calculoImposto = 0;
  ProportionalDiscount: number = 0;
  init: boolean = false;
  currentTC: number[] = [];
  lastTC: number[] = [];
  realizadoHora: Realizado = {
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
      analise: false
    }
  };
  horasAtuais: any;
  impostodivididoporshift: any = 0;
  dialogRef: any;
  realizado7 = 0

  ngOnDestroy(): void {
      clearInterval(this.intervaloRealizado)
  }

  ngOnInit(): void {
    this.modeloService.getAll().subscribe(res => {
      res.forEach(item => {
        if (item.is_current == true) {
          this.modeloAtual = item
        }
      })
      if (this.modeloAtual == undefined) {
        this.modeloService.changeIsCurrent('storm 120A', true)
      }
    })
    window.onload = () => {
      this.init = true;
    };
    for (let index = 0; index < 17; index++) {
      this.currentTC[index] = 0;
    }

    this.nodemcuService.getAll().subscribe((res) => {
      this.nodemcu = res;
      this.nodemcu.forEach(item => {
        this.counting[item.id!] = 0;
      })
      this.mainService.getAllMain().subscribe((res: Main[]) => {
        this.imposto = res[0].imposto;
        this.shiftTime = res[0].shiftTime;
        this.op = res[0].op;
      });
    });
    this.nodemcuService.getAllRealizado().subscribe((res) => {
      this.realizadoHora = res[0];
    });
    this.intervaloImposto = setInterval(() => {
      this.impostoIntervalo()
      this.retirarPausa();
    }, 1000);
    this.intervaloRealizado = setInterval(() => {
      this.realizadoIntevalo()
    }, 5000);
    setInterval(() => {
      if (this.horasAtuais == 17 && new Date().getMinutes() == 0) {
        clearInterval(this.intervaloImposto)
        clearInterval(this.intervaloRealizado)
      } else if (this.horasAtuais == 7 && new Date().getMinutes() == 0 && new Date().getSeconds() == 0) {
        this.intervaloImposto = setInterval(() => {
          this.impostoIntervalo()
        }, 1000)

        this.intervaloRealizado = setInterval(() => {
          this.realizadoIntevalo();
        }, 5000)
      }
    }, 1000)
  }

  realizadoIntevalo() {
    this.nodemcuService.getAllRealizado().subscribe((res) => {
      this.realizadoHora = res[0];
    });
    this.mainService.getAllMain().subscribe((res) => {
      this.imposto = res[0].imposto;
      this.shiftTime = res[0].shiftTime;
      this.op = res[0].op;
    });
    this.modeloService.getAll().subscribe(res => {
      res.forEach(item => {
        if (item.is_current == true) {
          this.modeloAtual = item
        }
      })

    })
    this.nodemcu.forEach(item => {
      if (item.nameId.pausa == true) {
        if (!this.dialog.openDialogs.length) {
          this.dialogRef = this.dialog.open(DialogPauseComponent, {
            width: '900px',
            height: '400px'
          });
        }
      } else {
        if (this.dialog.openDialogs.length) {
          this.dialogRef.close()
        }
      }
    });
  }

  impostoIntervalo() {
    this.impostodivididoporshift = (this.imposto / this.shiftTime / 60);
    this.diaDaSemanda = new Date();
    this.horasAtuais = new Date().getHours();
    this.mainService.getControleRealizadoByDate().subscribe((res) => {
      res.forEach((item) => {
        if (new Date(item.data).getDay() === new Date().getDay()) {
          if (item.realizadoHora == 7) {
            this.minutos.minutos7 = true;
          } else if (item.realizadoHora == 8) {
            this.minutos.minutos8 = true;
          } else if (item.realizadoHora == 9) {
            this.minutos.minutos9 = true;
          } else if (item.realizadoHora == 10) {
            this.minutos.minutos10 = true;
          } else if (item.realizadoHora == 11) {
            this.minutos.minutos11 = true;
          } else if (item.realizadoHora == 12) {
            this.minutos.minutos12 = true;
          } else if (item.realizadoHora == 13) {
            this.minutos.minutos14 = true;
          } else if (item.realizadoHora == 14) {
            this.minutos.minutos13 = true;
          } else if (item.realizadoHora == 15) {
            this.minutos.minutos15 = true;
          } else if (item.realizadoHora == 16) {
            this.minutos.minutos16 = true;
          } else if (item.realizadoHora == 17) {
            this.minutos.minutos17 = true;
          }
        }
      });
      if (this.horasAtuais == 7) {
        this.minutos8 = new Date().getMinutes();
      } else if (this.horasAtuais == 8) {
        this.minutos8 = 60;
        this.minutos9 = new Date().getMinutes();
      } else if (this.horasAtuais == 9) {
        if (
          this.realizadoHora.horas7 <
          this.minutos8 * (this.imposto / this.shiftTime / 60) - 0.5
        ) {
          if (!this.minutos.minutos8) {
            this.openDialogControleRealizado(
              this.realizadoHora.horas7,
              this.minutos8 * (this.imposto / this.shiftTime / 60) - 0.5,
              this.horasAtuais - 1
            );
          }
        }
        this.minutos8 = 60;
        this.minutos9 = 60;
        this.minutos10 = new Date().getMinutes();
      } else if (this.horasAtuais == 10) {
        if (
          this.realizadoHora.horas8 <
          this.minutos9 * (this.imposto / this.shiftTime / 60) - 0.5
        ) {
          if (!this.minutos.minutos9) {
            this.openDialogControleRealizado(
              this.realizadoHora.horas8,
              this.minutos9 * (this.imposto / this.shiftTime / 60) - 0.5,
              this.horasAtuais - 1
            );
          }
        }
        this.minutos8 = 60;
        this.minutos9 = 60;
        this.minutos10 = 60;
        this.minutos11 = new Date().getMinutes();
      } else if (this.horasAtuais == 11) {
        if (
          this.realizadoHora.horas9 <
          this.minutos10 * (this.imposto / this.shiftTime / 60) - 0.5
        ) {
          if (!this.minutos.minutos10) {
            this.openDialogControleRealizado(
              this.realizadoHora.horas9,
              this.minutos10 * (this.imposto / this.shiftTime / 60) - 0.5,
              this.horasAtuais - 1
            );
          }
        }
        this.minutos8 = 60;
        this.minutos9 = 60;
        this.minutos10 = 60;
        this.minutos11 = 60;
        this.minutos12 = new Date().getMinutes();
      } else if (this.horasAtuais == 12) {
        if (
          this.realizadoHora.horas10 <
          this.minutos11 * (this.imposto / this.shiftTime / 60) - 0.5
        ) {
          if (!this.minutos.minutos11) {
            this.openDialogControleRealizado(
              this.realizadoHora.horas10,
              this.minutos11 * (this.imposto / this.shiftTime / 60) - 0.5,
              this.horasAtuais - 1
            );
          }
        }
        this.minutos8 = 60;
        this.minutos9 = 60;
        this.minutos10 = 60;
        this.minutos11 = 60;
        this.minutos12 = 60;
        this.minutos13 = new Date().getMinutes();
      } else if (this.horasAtuais == 13) {
        if (
          this.realizadoHora.horas11 <
          this.minutos12 * (this.imposto / this.shiftTime / 60) - 0.5
        ) {
          if (!this.minutos.minutos12) {
            this.openDialogControleRealizado(
              this.realizadoHora.horas11,
              this.minutos12 * (this.imposto / this.shiftTime / 60) - 0.5,
              this.horasAtuais - 1
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
      } else if (this.horasAtuais == 14) {
        if (
          this.realizadoHora.horas12 <
          this.minutos13 * (this.imposto / this.shiftTime / 60) - 0.5
        ) {
          if (!this.minutos.minutos13) {
            this.openDialogControleRealizado(
              this.realizadoHora.horas12,
              this.minutos13 * (this.imposto / this.shiftTime / 60) - 0.5,
              this.horasAtuais - 1
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
      } else if (this.horasAtuais == 15) {
        if (
          this.realizadoHora.horas13 <
          this.minutos14 * (this.imposto / this.shiftTime / 60) - 0.5
        ) {
          if (!this.minutos.minutos14) {
            this.openDialogControleRealizado(
              this.realizadoHora.horas13,
              this.minutos14 * (this.imposto / this.shiftTime / 60) - 0.5,
              this.horasAtuais - 1
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
      } else if (this.horasAtuais == 16) {
        if (
          this.realizadoHora.horas14 <
          this.minutos15 * (this.imposto / this.shiftTime / 60) - 0.5
        ) {
          if (!this.minutos.minutos15) {
            this.openDialogControleRealizado(
              this.realizadoHora.horas14,
              this.minutos15 * (this.imposto / this.shiftTime / 60) - 0.5,
              this.horasAtuais - 1
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
      } else if (this.horasAtuais == 17) {
        if (
          this.realizadoHora.horas15 <
          this.minutos16 * (this.imposto / this.shiftTime / 60) - 0.5
        ) {
          if (!this.minutos.minutos16) {
            this.openDialogControleRealizado(
              this.realizadoHora.horas15,
              this.minutos16 * (this.imposto / this.shiftTime / 60) - 0.5,
              this.horasAtuais - 1
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
    const minutes1 = newDatehours.getMinutes();
    this.date = hours1 * 60 + minutes1;

    this.effectiveTime = this.date;

    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');

    this.hours = `${hours}:${minutes}`;
    this.getValues();


    this.nodemcuService.getAll().subscribe((res) => {
      this.nodemcu = res;
      this.MediaHorarioRealizada = 0;
      this.TCmedioRealizado = 0;
      this.getRealizado();
    });
    this.dataAtual = new Date();
  }

  openDialogControleRealizado(
    realizado: number,
    imposto: number,
    realizadoHora: number
  ) {
    // if (this.dialog.openDialogs.length > 0) {
    //   return;
    // }

    // const dialogRef = this.dialog.open(DialogControleRealizadoComponent);
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result.length > 5) {
    //     this.mainService
    //       .postControleRealizado(imposto, realizado, realizadoHora, result)
    //       .subscribe((res) => {});
    //   }
    // });
  }

  getRealizado() {
    this.nodemcu.forEach((res) => {
      this.TCmedioRealizado += res.tcmedio;
      this.MediaHorarioRealizada += res.tcmedio;
      if (res.nameId.name == "160") {
        this.realizado = res.count;
      }
    });
    this.TCmedioRealizado = this.TCmedioRealizado / this.nodemcu.length - 1;
    this.MediaHorarioRealizada =
      (this.MediaHorarioRealizada / this.nodemcu.length - 1) / 8.5;
  }

  getValues() {
    if (this.hours >= '09:20') {
      this.effectiveTime = this.effectiveTime - 10;
      this.ProportionalDiscount = 10 / (this.TCimpostado / 60);
    }
    if (this.hours >= '12:00') {
      this.effectiveTime = this.effectiveTime - 60;
      this.ProportionalDiscount =
        this.ProportionalDiscount + 60 / (this.TCimpostado / 60);
    }
    if (this.hours >= '14:10') {
      this.effectiveTime = this.effectiveTime - 10;
      this.ProportionalDiscount =
        this.ProportionalDiscount + 10 / (this.TCimpostado / 60);
    }
    this.TCimpostado = 3600 / (this.imposto / this.shiftTime);


    if (this.horasAtuais < 12 || this.horasAtuais >= 13) {
      this.previsto =
        this.date / (this.TCimpostado / 60) - this.ProportionalDiscount;
    }
    if (this.horasAtuais >= 17 && this.horasAtuais < 7) {
      this.previsto = this.imposto
    }

    if (this.isPrevisto == false) {
      this.isPrevisto = true
      setTimeout(() => {
        this.previsto =
          this.date / (this.TCimpostado / 60) - this.ProportionalDiscount;
      }, 3000)
    }
  }

  parseToInt(value: string): number {
    return parseInt(value, 0);
  }

  retirarPausa() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    if(new Date().getDay() != 5){
      if (hours === 9 && minutes === 30) {
        this.nodemcuService.pausa(true).subscribe()
      } else if (hours === 9 && minutes === 40) {
        this.nodemcuService.pausa(false).subscribe()
      } else if (hours === 12 && minutes === 0) {
        this.nodemcuService.pausa(true).subscribe()
      } else if (hours === 13 && minutes === 0) {
        this.nodemcuService.pausa(false).subscribe()
      } else if (hours === 15 && minutes === 5) {
        this.nodemcuService.pausa(true).subscribe()
      } else if (hours === 15 && minutes === 15) {
        this.nodemcuService.pausa(false).subscribe()
      }
    }else{
      if (hours === 9 && minutes === 30) {
        this.nodemcuService.pausa(true).subscribe()
      } else if (hours === 9 && minutes === 40) {
        this.nodemcuService.pausa(false).subscribe()
      } else if (hours === 12 && minutes === 0) {
        this.nodemcuService.pausa(true).subscribe()
      } else if (hours === 13 && minutes === 0) {
        this.nodemcuService.pausa(false).subscribe()
      } else if (hours === 14 && minutes === 25) {
        this.nodemcuService.pausa(true).subscribe()
      } else if (hours === 14 && minutes === 35) {
        this.nodemcuService.pausa(false).subscribe()
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
            .put(this.imposto, this.TCimpostado, this.shiftTime, this.op)
            .subscribe();
        }
        this.shiftTime = result.split(',')[1];
        if (this.shiftTime == 0) {
          if (this.diaDaSemanda.getDay() == 5) {
            this.shiftTime = 6.66
          } else {
            this.shiftTime = 7.66;
          }
          this.mainService
            .put(this.imposto, this.TCimpostado, this.shiftTime, this.op)
            .subscribe();
          this.getValues();
        }
        var op = result.split(',')[2]
        if (op != "") {
          this.mainService
            .put(this.imposto, this.TCimpostado, this.shiftTime, op)
            .subscribe();
          this.getValues();
        }
      }
    });
  }
}
