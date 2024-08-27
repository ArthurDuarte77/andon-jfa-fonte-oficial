import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Main } from 'src/app/model/main';
import { Nodemcu } from 'src/app/model/nodemcu';
import { Operation } from 'src/app/model/operation/operation';
import { Realizado } from 'src/app/model/realizado';
import { OperationService } from 'src/app/service/operation.service';
import { DialogHelpComponent } from 'src/app/shared/dialog-help/dialog-help.component';
import { DialogAvisoComponent } from 'src/app/shared/dialog-aviso/dialog-aviso.component';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
})
export class CounterComponent implements OnInit, OnDestroy {
  // Fazendo a Injeção de Dependências
  constructor(
    private operationService: OperationService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }
  // Declarando as váriaveis
  isOnline: boolean = false;
  imposto: number = 0;
  shiftTime: number = 8.66;
  minutos8: number = 0;
  minutos9: number = 0;
  realizadoInterval!: NodeJS.Timer;
  onAjuda: boolean = false;
  minutos10: number = 0;
  minutos11: number = 0;
  minutos12: number = 0;
  minutos13: number = 0;
  minutos14: number = 0;
  minutos15: number = 0;
  minutos16: number = 0;
  minutos17: number = 0;
  realizadoHora!: Realizado;
  realizadoHoraAtual: number = 0;
  currentState: string = '';
  azulStateCalled: boolean = false;
  vermelhoStateCalled: boolean = false;
  verificarSeFoiUmaVez: boolean = true;
  localData: Date | undefined;
  intervalo!: NodeJS.Timer;
  tempoOcioso: number = 0;
  stateButton: boolean = true;
  loadingButton: boolean = false;
  contadorRodando: boolean = false;
  contador: number = 0;
  intervalRef: any;
  intervalRefNew: any;
  count: number = 0;
  maintenance: number = 0;
  lmitedTime: number = 0;
  limitedTimeOcioso: number = 0;
  teste: any = true;
  labelPosition: string = '';
  newConter: number = 0;
  nomeOperacao: number = 0;
  newMaintenance: number = 0;
  nomeOperador: string = '';
  qrcodeValue: string = '';
  analiseButton: boolean = false;
  onAnalise: boolean = false;
  onFonteGrande: boolean = false;
  onPausa: boolean = false;
  operation: Operation = {
    id: 0,
    name: '',
    limitedTime: 0,
    ocupado: false,
    pausa: false,
    analise: false,
  };
  // Declaro a variavel storage que vai armazenar o local Storage
  storage: Storage = localStorage;

  // Quando o site iniciar ele vai executar tudo que esta aqui dentro
  ngOnInit() {
    // Adiciona listeners para os eventos de online e offline
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());

    // Atualiza o status inicial
    this.updateOnlineStatus();
    // Pega os parametros das rotas para saber qual operação
    this.route.params.subscribe((params) => {
      this.nomeOperacao = params['name'];
      // Faz a requisição para pegar todos os dados da operação
      this.operationService.get(params['name']).subscribe((res) => {
        this.operation = res;

        this.operationService.getByName(this.operation.name).subscribe(
          (res) => {
            this.count = res.count;
            this.maintenance = res.maintenance;
          },
          (errr) => {
            this.openSnackBar('Erro no Service', 'Ok');
          }
        );
      });
      this.operationService
        .getRealizadoHoraria(`${this.nomeOperacao}`)
        .subscribe((res: any) => {
          this.realizadoHora = res;
        });
    });
    this.operationService.getTCimposto().subscribe(
      (res: Main[]) => {
        res.forEach((res) => {
          this.lmitedTime = res.tcimposto;
          this.limitedTimeOcioso = res.tcimposto;
          this.imposto = res.imposto;
          this.shiftTime = res.shiftTime;
          this.ajustarTempoEnvelhecimento();
        });
      },
      (error) => {
        this.openSnackBar('Erro no Service', 'Ok');
      }
    );
    setInterval(() => {
      this.operationService.getTCimposto().subscribe(
        (res: Main[]) => {
          res.forEach((res) => {
            this.lmitedTime = res.tcimposto;
            this.limitedTimeOcioso = res.tcimposto;
            this.imposto = res.imposto;
            this.shiftTime = res.shiftTime;
            this.ajustarTempoEnvelhecimento();
          });
        },
        (error) => {
          this.openSnackBar('Erro no Service', 'Ok');
        }
      );
      const data = new Date();
      if (data.getMinutes() == 0 && this.verificarSeFoiUmaVez == true) {
        this.verificarSeFoiUmaVez = false;
      } else if (data.getMinutes() == 1) {
        this.verificarSeFoiUmaVez = true;
      }
      this.getAllRealizado()
    }, 60000);
    setTimeout(() => {
      this.intervaloCounter();
    }, 1000);
    this.realizadoInterval = setInterval(() => {
      var horas = new Date().getHours();
      if (horas == 7) {
        this.minutos8 = new Date().getMinutes();
      } else if (horas == 8) {
        this.minutos8 = 60;
        this.minutos9 = new Date().getMinutes();
      } else if (horas == 9) {
        this.minutos8 = 60;
        this.minutos9 = 60;
        this.minutos10 = new Date().getMinutes();
      } else if (horas == 10) {
        this.minutos8 = 60;
        this.minutos9 = 60;
        this.minutos10 = 60;
        this.minutos11 = new Date().getMinutes();
      } else if (horas == 11) {
        this.minutos8 = 60;
        this.minutos9 = 60;
        this.minutos10 = 60;
        this.minutos11 = 60;
        this.minutos12 = new Date().getMinutes();
      } else if (horas == 12) {
        this.minutos8 = 60;
        this.minutos9 = 60;
        this.minutos10 = 60;
        this.minutos11 = 60;
        this.minutos12 = 60;
        this.minutos13 = new Date().getMinutes();
      } else if (horas == 13) {
        this.minutos8 = 60;
        this.minutos9 = 60;
        this.minutos10 = 60;
        this.minutos11 = 60;
        this.minutos12 = 60;
        this.minutos13 = 60;
        this.minutos14 = new Date().getMinutes();
      } else if (horas == 14) {
        this.minutos8 = 60;
        this.minutos9 = 60;
        this.minutos10 = 60;
        this.minutos11 = 60;
        this.minutos12 = 60;
        this.minutos13 = 60;
        this.minutos14 = 60;
        this.minutos15 = new Date().getMinutes();
      } else if (horas == 15) {
        this.minutos8 = 60;
        this.minutos9 = 60;
        this.minutos10 = 60;
        this.minutos11 = 60;
        this.minutos12 = 60;
        this.minutos13 = 60;
        this.minutos14 = 60;
        this.minutos15 = 60;
        this.minutos16 = new Date().getMinutes();
      } else if (horas == 16) {
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
      } else if (horas == 17) {
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
        this.minutos17 = new Date().getMinutes();
      }
    }, 100)
  }

  getAllRealizado() {
    this.operationService
      .getRealizadoHoraria(`${this.nomeOperacao}`)
      .subscribe((res: any) => {
        if (res.nameId.analise == true) {
          this.onAnalise = true;
          clearInterval(this.intervalRef);
          clearInterval(this.intervalRefNew);
          clearInterval(this.intervalo);
          this.vermelhoStateCalled = false;
          this.tempoOcioso = 0;
          this.stateButton = true;
          this.contador = 0;
          this.tempoOcioso = 0;
          this.stateButton = true;
          this.contadorRodando = false;
          this.contador = 0;
          this.azulStateCalled = true;
        } else {
          this.onAnalise = false;
          this.azulStateCalled = false;
          this.currentState = 'verde';
          clearInterval(this.intervalo);
          this.intervaloCounter();
        }

        if (res.nameId.pausa == true) {
          this.onPausa = true;
          clearInterval(this.intervalRef);
          clearInterval(this.intervalRefNew);
          clearInterval(this.intervalo);
          this.vermelhoStateCalled = false;
          this.tempoOcioso = 0;
          this.stateButton = true;
          this.contador = 0;
          this.tempoOcioso = 0;
          this.stateButton = true;
          this.contadorRodando = false;
          this.contador = 0;
          this.operationService.atualizar(this.operation.id, false).subscribe(res => {
            this.openSnackBar('Enviado com sucesso', 'Ok');
          }, error => {
            this.openSnackBar('Erro no Service', 'Ok');
          })
          this.operationService.atualizarState(this.operation.name, 'verde');
        } else {
          this.onPausa = false;
          clearInterval(this.intervalo);
          this.intervaloCounter();
        }




        this.count = 0;
        this.realizadoHora = res;
        this.count += res.horas7;
        this.count += res.horas8;
        this.count += res.horas9;
        this.count += res.horas10;
        this.count += res.horas11;
        this.count += res.horas12;
        this.count += res.horas13;
        this.count += res.horas14;
        this.count += res.horas15;
        this.count += res.horas16;
        this.count += res.horas17;
        var horas = new Date().getHours();
        if (horas == 7) {
          this.realizadoHoraAtual = this.realizadoHora.horas7;
        } else if (horas == 8) {
          this.realizadoHoraAtual = this.realizadoHora.horas8;
        } else if (horas == 9) {
          this.realizadoHoraAtual = this.realizadoHora.horas9;
        } else if (horas == 10) {
          this.realizadoHoraAtual = this.realizadoHora.horas10;
        } else if (horas == 11) {
          this.realizadoHoraAtual = this.realizadoHora.horas11;
        } else if (horas == 12) {
          this.realizadoHoraAtual = this.realizadoHora.horas12;
        } else if (horas == 13) {
          this.realizadoHoraAtual = this.realizadoHora.horas13;
        } else if (horas == 14) {
          this.realizadoHoraAtual = this.realizadoHora.horas14;
        } else if (horas == 15) {
          this.realizadoHoraAtual = this.realizadoHora.horas15;
        } else if (horas == 16) {
          this.realizadoHoraAtual = this.realizadoHora.horas16;
        }
      });
  }

  enterFullscreen() {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  }

  intervaloCounter() {
    this.intervalo = setInterval(() => {
      if (
        !this.contadorRodando &&
        this.analiseButton != true &&
        this.onAnalise != true &&
        this.onFonteGrande != true
      ) {
        if (this.tempoOcioso > this.limitedTimeOcioso) {
          if (!this.vermelhoStateCalled) {
            this.operationService.atualizarState(
              this.operation.name,
              'vermelho'
            );
            this.vermelhoStateCalled = true;
          }
        }

        if (
          this.tempoOcioso ===
          parseInt((this.limitedTimeOcioso + 60).toFixed(0))
        ) {
          this.operationService.changeTimeExcess(this.operation.name);
        }

        this.tempoOcioso++;
      }
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.realizadoInterval);
    clearInterval(this.intervalo);
    this.stopTimer('');
  }

  openDialogAviso(): void {
    this.dialog.open(DialogAvisoComponent, {
      width: '900px',
      height: '400px',
    });
  }

  toggleContagem(state: string) {
    clearInterval(this.intervalo);
    this.vermelhoStateCalled = false;
    this.tempoOcioso = 0;
    if (this.contadorRodando) {
      if (this.contador >= 15) {
        this.tempoOcioso = 0;
        this.intervaloCounter();
        this.stopTimer(state);
        this.stateButton = true;
        this.contador = 0;
      } else {
        this.openDialogAviso();
        this.operationService.postIndisponivel(this.operation.name).subscribe();
      }
    } else {
      if (state != 'refuse') {
        this.iniciarContagem(state);
        this.stateButton = false;
      }
    }
  }

  iniciarContagem(state: string) {
    this.vermelhoStateCalled = false;
    this.tempoOcioso = 0;
    this.contadorRodando = true;
    this.operationService.getTempo(this.operation.id).subscribe(res => {
      if (res._couting == false) {
        this.operationService.atualizar(this.operation.id, true).subscribe(res => {
          this.openSnackBar('Enviado com sucesso', 'Ok');
        }, error => {
          this.openSnackBar('Erro no Service', 'Ok');
        })
      } else {
        this.operationService.atualizar(this.operation.id, false).subscribe(res => {
          this.openSnackBar('Enviado com sucesso', 'Ok');
          this.operationService.atualizar(this.operation.id, true).subscribe(res => {
            this.openSnackBar('Enviado com sucesso', 'Ok');
          }, error => {
            this.openSnackBar('Erro no Service', 'Ok');
          })
        }, error => {
          this.openSnackBar('Erro no Service', 'Ok');
        })
      }
    })
    this.intervalRef = setInterval(() => {
      this.lmitedTime = parseInt(this.lmitedTime.toFixed(0))
      this.limitedTimeOcioso = parseInt(this.limitedTimeOcioso.toFixed(0))
      this.contador++;
      if (
        this.contador === parseInt((this.lmitedTime + 60).toFixed(0))
      ) {
        this.operationService.changeTimeExcess(this.operation.name);
      }
      if (this.contador > 9999) {
        this.stopTimer(state);
      } else if (this.contador == this.lmitedTime) {
        this.operationService.atualizarState(this.operation.name, 'vermelho');
        this.vermelhoStateCalled = false;
      } else if (this.contador == this.lmitedTime * 2) {
        this.operationService.atualizarState(this.operation.name, 'vermelho');
        this.vermelhoStateCalled = true;
      } else if (this.contador == 1) {
        this.operationService.atualizarState(this.operation.name, 'verde');
      }
    }, 1000);
  }

  stopTimer(state: string) {
    this.operationService.getTempo(this.operation.id).subscribe(res => {
      if (res._couting == true) {
        this.operationService.atualizar(this.operation.id, false).subscribe(res => {
          this.openSnackBar('Enviado com sucesso', 'Ok');
        }, error => {
          this.openSnackBar('Erro no Service', 'Ok');
        })
      }
    })
    if (state == 'refuse') {
      this.maintenance++;
    }
    this.contadorRodando = false;
    clearInterval(this.intervalRef);
    clearInterval(this.intervalRefNew);
    if (
      this.contador > this.lmitedTime &&
      this.contador < this.lmitedTime * 2
    ) {
      var body: Nodemcu = {
        count: this.count,
        state: 'verde',
        currentTC: this.contador,
        nameId: this.operation,
        maintenance: this.maintenance,
        shortestTC: this.contador,
      };
      this.operationService.post(body).subscribe((res) => { });
    } else if (this.contador >= this.lmitedTime * 2) {
      var body: Nodemcu = {
        count: this.count,
        state: 'verde',
        currentTC: this.contador,
        nameId: this.operation,
        maintenance: this.maintenance,
        shortestTC: this.contador,
      };
      this.operationService.post(body).subscribe((res) => { });
    } else {
      var body: Nodemcu = {
        count: this.count,
        state: 'verde',
        currentTC: this.contador,
        nameId: this.operation,
        maintenance: this.maintenance,
        shortestTC: this.contador,
      };
      this.operationService.post(body).subscribe((res) => { });
    }
    this.contador = 0;
    setTimeout(() => {
      this.getAllRealizado()
    }, 1000)
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  openDialog() {
    if (this.operation.name === '010') {
      var data = [
        'https://www.youtube.com/embed/s2vDuQ9jpdw?si=h07QbnjSl0jEzYEs&vq=small&quality=tiny',
        'https://www.youtube.com/embed/rxv7e7Q674o?si=uGlDJIR8IjAWV5RG&vq=small&quality=tiny',
        'https://www.youtube.com/embed/YHZJN-4buiE?si=kkcZ-RiDkB38b7aT&vq=small&quality=tiny',
      ];
    } else if (this.operation.name === '020') {
      var data = [
        'https://www.youtube.com/embed/ksfYL1ODJc4?si=WaeJV80yrAZehXRC&vq=small&quality=tiny',
        'https://www.youtube.com/embed/G7QpqSFGRwA?si=VXnRWLg37Bq4SGBF&vq=small&quality=tiny',
      ];
    } else if (this.operation.name === '030') {
      var data = [
        'https://www.youtube.com/embed/V04k--C6glc?si=i7Cwq_-1H9ImWc61&vq=small&quality=tiny',
        'https://www.youtube.com/embed/ve0iyZQNgoE?si=bbLCed56ugwpOuev&vq=small&quality=tiny',
        'https://www.youtube.com/embed/3WzWK5FljUk?si=vjg3KuK__ZSBxCBU&vq=small&quality=tiny',
        'https://www.youtube.com/embed/4V7teTOoY7o?si=341KTg7DCQK3UWD5&vq=small&quality=tiny',
        'https://www.youtube.com/embed/hUMEiPy0iSY?si=A0DfDvwoPVj6H1K6&vq=small&quality=tiny',
      ];
    } else if (this.operation.name === '040') {
      var data = [
        'https://www.youtube.com/embed/CI4bpJHTd6k?si=B-J52p_lGieAE30t&vq=small&quality=tiny',
        'https://www.youtube.com/embed/87iOvOalQTU?si=O_83t60bDhpBYvt3&vq=small&quality=tiny',
        'https://www.youtube.com/embed/1hweE7SAzSk?si=KLF6R2x2I6nievGd&vq=small&quality=tiny',
        'https://www.youtube.com/embed/aMIgqDLO9xM?si=NC_qz-A5ByjoTSLj&vq=small&quality=tiny',
        'https://www.youtube.com/embed/97u5Yn5SrF8?si=aPZissTsNpSA_jDv&vq=small&quality=tiny',
        'https://www.youtube.com/embed/GnSZxDvBdG0?si=RQI5ShH4Qwcb1Lx&vq=small&quality=tiny',
      ];
    } else if (this.operation.name === '050') {
      var data = [
        'https://www.youtube.com/embed/89FzrMcU98w?si=sfgR7DU-cAe8YdQT&vq=small&quality=tiny',
        'https://www.youtube.com/embed/nowHrrIdK1U?si=JL_EYs8aBGeh06A7&vq=small&quality=tiny',
        'https://www.youtube.com/embed/vH2h3_Y382A?si=uyE7wDv4wTO5Mo5C&vq=small&quality=tiny',
        'https://www.youtube.com/embed/d4fxfI7M83Y?si=AEnAi-CILl9RP-GU&vq=small&quality=tiny',
      ];
    } else if (this.operation.name === '060') {
      var data = [
        'https://www.youtube.com/embed/asjtADC5zHM?si=p88jYkIbApne_Z5p&vq=small&quality=tiny',
        'https://www.youtube.com/embed/S6uU0SKhCx4?si=yZ-81pxccbsAPkjv&vq=small&quality=tiny',
        'https://www.youtube.com/embed/oUeZDmqscg8?si=dOs2QYjsUrFsWhhY&vq=small&quality=tiny',
        'https://www.youtube.com/embed/YBZmn44HAVA?si=ZzoWvbK2_rioJQKt&vq=small&quality=tiny',
        'https://www.youtube.com/embed/0RLwkBGf7Dg?si=8daMVu68eE8jshxG&vq=small&quality=tiny',
        'https://www.youtube.com/embed/7shXjAPdUPM?si=k1vRvSgbDUdp1I1L&vq=small&quality=tiny',
      ];
    } else if (this.operation.name === '070') {
      var data = [
        'https://www.youtube.com/embed/f_Y0nA5R7c0?si=h3NZc4WvN8ySyCDj&vq=small&quality=tiny',
        'https://www.youtube.com/embed/fIIWSzsaef8?si=wHbOjDJrJRABB5eE&vq=small&quality=tiny',
        'https://www.youtube.com/embed/d5VfZ86xgCc?si=xSFoMmsXlp4oWqWV&vq=small&quality=tiny',
      ];
    } else if (this.operation.name === '080') {
      var data = [''];
    } else if (this.operation.name === '090') {
      var data = [''];
    } else if (this.operation.name === '100') {
      var data = [''];
    } else if (this.operation.name === '110') {
      var data = [''];
    } else if (this.operation.name === '120') {
      var data = [
        'https://www.youtube.com/embed/Zk5dbikqDBI?si=ubTcELeTBqyL6MtT&vq=small&quality=tiny',
        'https://www.youtube.com/embed/LJtG77ykPYg?si=WmCdkVrYAMAp6KQC&vq=small&quality=tiny',
        'https://www.youtube.com/embed/tE_1_L7oeHs?si=RYMny-JDuMBFnwV8&vq=small&quality=tiny',
      ];
    } else if (this.operation.name === '130') {
      var data = [
        'https://www.youtube.com/embed/RfbnWqIAsSY?si=vdFdd7SyPBOmzGPE&vq=small&quality=tiny',
        'https://www.youtube.com/embed/oMz8IRonqJg?si=BchG-LtU0nNuoMR1&vq=small&quality=tiny',
        'https://www.youtube.com/embed/rxufZSFBSNA?si=sdLKoeZ7Uj6WFR26&vq=small&quality=tiny',
      ];
    } else if (this.operation.name === '140') {
      var data = [
        'https://www.youtube.com/embed/wFuwL9Q34cM?si=7JUFOt4y7hSeSgsS&vq=small&quality=tiny',
        'https://www.youtube.com/embed/C6C7eSEPlDI?si=bhLwUiZZewxGk2_V&vq=small&quality=tiny',
      ];
    } else if (this.operation.name === '150') {
      var data = [
        'https://www.youtube.com/embed/-fn6pTvqKOg?si=fA4ZEeGblNc-opbx&vq=small&quality=tiny',
        'https://www.youtube.com/embed/QZeiNWH3KnU?si=KSfPf1gIU3ANMgE1&vq=small&quality=tiny',
        'https://www.youtube.com/embed/lcek13SiARA?si=6aY5r2ARxXlLtzX2&vq=small&quality=tiny',
      ];
    } else if (this.operation.name === '160') {
      var data = [
        'https://www.youtube.com/embed/na9x9Cw8bLQ?si=gY2AuxXj0PRQSjAV&vq=small&quality=tiny',
      ];
    } else {
      data = [''];
    }
    const dialogRef = this.dialog.open(DialogHelpComponent, {
      data: data,
    });
  }

  ajustarTempoEnvelhecimento() {
    if (
      this.operation.name == '100' ||
      this.operation.name == '110' ||
      this.operation.name == '080' ||
      this.operation.name == '090'
    ) {
      this.lmitedTime = 180;
    }
  }

  ajuda() {
    this.onAjuda = !this.onAjuda;
    if (this.onAjuda) {
      this.operationService.changeAjuda(this.operation.name);
      clearInterval(this.intervalo);
      this.tempoOcioso = 0;
      this.intervaloCounter();
      this.stateButton = true;
      this.contador = 0;
      this.contadorRodando = false;
      clearInterval(this.intervalRef);
      clearInterval(this.intervalRefNew);
      this.vermelhoStateCalled = false;
      this.azulStateCalled = false;
      this.operationService.atualizar(this.operation.id, false).subscribe(res => {
        this.openSnackBar('Enviado com sucesso', 'Ok');
      }, error => {
        this.openSnackBar('Erro no Service', 'Ok');
      })
    } else {
      this.operationService.atualizarState(this.operation.name, 'verde');
    }
  }


  private updateOnlineStatus() {
    this.isOnline = navigator.onLine;
  }
}
