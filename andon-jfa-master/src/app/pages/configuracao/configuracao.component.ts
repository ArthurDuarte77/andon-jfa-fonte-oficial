import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import Chart from 'chart.js/auto';
import { Main } from 'src/app/module/main';
import { Modelo } from 'src/app/module/modelo';
import { Nodemcu } from 'src/app/module/nodemcu';
import { Operation } from 'src/app/module/operation';
import { Pausa } from 'src/app/module/pausa';
import { Realizado } from 'src/app/module/realizado';
import { RealizadoGeral } from 'src/app/module/realizadoGeral';
import { RealizadoHoraria } from 'src/app/module/realizadoHoraria';
import { ResultadoGeral } from 'src/app/module/resultadoGeral';
import { MainService } from 'src/app/service/main.service';
import { ModeloService } from 'src/app/service/modelo.service';
import { NodemcuService } from 'src/app/service/nodemcu.service';
import { RelatorioService } from 'src/app/service/relatorio.service';
import { DialogAddComponent } from 'src/app/shared/dialog-add/dialog-add.component';
import { MatDatepicker } from '@angular/material/datepicker';
import * as moment from 'moment';



export interface Programacao{
  id: number,
  date: Date,
  previsto: number,
  realizado: number,
  modelo: string
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.scss'],
})
export class ConfiguracaoComponent implements OnInit {

  dialog = inject(MatDialog);

  constructor(private cdr: ChangeDetectorRef, private nodemcuService: NodemcuService, private mainService: MainService, private modeloService: ModeloService, private _snackBar: MatSnackBar, private relatorioService: RelatorioService) { }

  nodemcu: Nodemcu[] = []
  filteredData: Nodemcu[] = []
  dataSource: Nodemcu[] = []
  dataSourceRealizado: Realizado[] = []
  displayedColumns: string[] = ['id', 'name_id', 'name', 'ocupado', 'pausa', 'contador_id', 'contador', 'contando', 'count', 'firtlastTC', 'state', 'currentTC', 'analise', 'time_excess', 'maintenance', 'secondtlastTC', 'ajuda', 'thirdlastTC', 'shortestTC', 'qtdeTCexcedido', 'tcmedio'];
  displayedColumnsRealizado: string[] = ['id', 'horas7', 'horas8', 'horas9', 'horas10', 'horas11', 'horas12', 'horas13', 'horas14', 'horas15', 'horas16', 'horas17'];
  displayedColumnsRealizadoTablet: string[] = ['id', 'name_id', 'name', 'ocupado', 'pausa', 'horas7', 'horas8', 'horas9', 'horas10', 'horas11', 'horas12', 'horas13', 'horas14', 'horas15', 'horas16', 'horas17'];
  displayedColumnsMain: string[] = ['id', 'tcimposto', 'imposto', 'shiftTime', 'op'];
  displayedColumnsModelo: string[] = ['id', 'is_current', 'modelo', 'realizado', 'tempo'];
  displayedColumnsOperation: string[] = ['id', 'analise', 'name', 'ocupado', 'pausa'];
  dataSourceRealizadoTablet: Realizado[] = []
  dataSourceMain: Main[] = []
  dataSourceModelo: Modelo[] = []
  dataSourceOperation: Operation[] = []
  dataSourceProgramacao: Programacao[] = []
  displayedColumnsProgramacao: string[] = ["data", "previsto", "realizado", "modelo"]
  tabelas: string[] = ["Andon", "Realizado Horaria", "Realizado Horaria Tablet", "Pogramação", "Modelos", "Operações", "Programação Mensal"]
  chosenTable: string = "Andon"

  resultadoGeral: ResultadoGeral[] = [];
  dataImposto: number[] = [];
  dataTcImpostado: number[] = []
  dataRealizado: any[] = [];
  data: Date[] = [];
  controleRealizado: RealizadoGeral[] = [];
  realizado: Realizado[] = [];
  dataImpostoRealizado: number[] = [];
  realizadoData: number[] = [];
  worstOp: number = 0
  TCimpostado: number = 0;
  months = ["Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
  ];
  worstTcOp: number = 0
  bestOp: number = 0;
  bestHour: string = ""
  bestTcOp: number = 0
  tcMedio: number[] = []
  dataRealizadoTotal: any[] = []
  dateRealizadoTotal: number[] = []
  totalImposto: number = 0;
  modelos: String[] = []
  realizadoModelos: number[] = [];
  totalRealizado: number = 0;
  curreantMonth: number = new Date().getMonth()
  worstHour: string = "";
  time_excess: number[] = []
  bestTimeExcessOp: number = 0
  worstTimeExcessOp: number = 0
  analise: number[] = []
  ausencia: number[] = []
  interrupcoes: number[] = []
  tempoContadoExcedido: number[] = []
  names: number[] = []
  valueDataAtual = `${new Date().getFullYear()}-${new Date().getMonth()}`
  today = new Date();


  date = new FormControl(moment());

  chosenMonthHandler(normalizedMonth: moment.Moment, datepicker: MatDatepicker<any>) {
    const ctrlValue = this.date.value!;
    const month = moment(normalizedMonth);
    ctrlValue.month(month.month() + 1);
    ctrlValue.year(month.year());
    ctrlValue.date(month.date());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.getData(month.month(), month.year())
  }

  ngOnInit(): void {
    this.nodemcuService.getAll().subscribe((res) => {
      this.nodemcu = res;
      this.filteredData = [...this.nodemcu];
      this.dataSource = this.filteredData;
    })
    this.nodemcuService.getAllRealizado().subscribe((res) => {
      this.dataSourceRealizado = res
    })

    this.mainService.getAllRealizado().subscribe(res => {
      this.dataSourceRealizadoTablet = res
    })
    this.mainService.getAllMain().subscribe(res => {
      this.dataSourceMain = res
    })
    this.modeloService.getAll().subscribe(res => {
      this.dataSourceModelo = res
    })

    this.nodemcuService.getAllOperation().subscribe(res => {
      this.dataSourceOperation = res
    })

    this.getData(new Date().getMonth(), new Date().getFullYear())

  }

  saveData(data: Nodemcu[]) {
  }

  openSnackBar(text: string) {
    this._snackBar.open(text, 'OK', {
      horizontalPosition: "center",
      verticalPosition: "bottom",
    });
  }

  getData(month: number, year: number) {
    console.log(month, year)
    this.data = [];
    this.dataImposto = [];
    this.dataRealizado = [];
    this.modelos = [];
    this.realizadoModelos = [];

    this.nodemcuService.getAllResultadoGeral().subscribe(res => {
      this.resultadoGeral = res;
      const currentDate = new Date();
      const currentMonth = month;
      const currentYear = year

      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      this.dataSourceProgramacao = []
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dayOfWeek = date.getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          this.data.push(date);
          this.dataImposto.push(0);
          this.dataRealizado.push(0);
          this.dataSourceProgramacao.push({id: 0,date: date,previsto: 0, realizado: 0, modelo: 'NA'})
        }
      }

      this.resultadoGeral.forEach(item => {
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i].getDate() === new Date(item.data).getDate() && this.data[i].getMonth() === new Date(item.data).getMonth() && this.data[i].getFullYear() === new Date(item.data).getFullYear()) {
            this.dataImposto[i] = item.imposto;
            this.dataRealizado[i] = item.realizado;
            this.dataSourceProgramacao[i].id = item.id!
            this.dataSourceProgramacao[i].previsto = item.imposto
            this.dataSourceProgramacao[i].realizado = item.realizado
            this.dataSourceProgramacao[i].modelo = item.modelo
          }
        }
      });
      setTimeout(() => {      
        this.dataSourceProgramacao.forEach(item => {
          if(item.id == 0){
            var body: ResultadoGeral = {
              imposto: 0,
              realizado: 0,
              data: new Date(item.date).getTime(),
              modelo: 'NA'
            }
            this.relatorioService.postGeral(body).subscribe(res => {
              item.id = res.id!
              item.realizado = res.realizado
              item.previsto = res.imposto
              item.modelo = res.modelo
            })
          }
        })
        this.cdr.detectChanges();
      }, 1000);
    });
  }

  addData(columns: string[], name: string) {
    const dialogRef = this.dialog.open(DialogAddComponent, {
      width: '60%',
      data: {
        columns,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (name == "nodemcu") {
        var body: Nodemcu = {
          nameId: {
            id: result.name_id,
            name: result.name,
            ocupado: result.ocupado,
            pausa: result.pausa,
            analise: result.analise
          },
          contador: {
            id: result.contador_id,
            contadorAtual: result.contador,
            is_couting: result.contando
          },
          count: result.count,
          firtlastTC: result.firtlastTC,
          state: result.state,
          currentTC: result.currentTC,
          analise: result.analise,
          time_excess: result.time_excess,
          maintenance: result.maintenance,
          secondtlastTC: result.secondtlastTC,
          ajuda: result.ajuda,
          thirdlastTC: result.thirdlastTC,
          shortestTC: result.shortestTC,
          qtdetcexcedido: result.qtdeTCexcedido,
          tcmedio: result.tcmedio
        }
        this.nodemcuService.postNodemcu(body).subscribe(res => {
          console.log(res)
        })
      } else if (name == "realizadoTablet") {
        var body2: Realizado = {
          id: result.name,
          horas7: result.horas7,
          horas8: result.horas8,
          horas9: result.horas9,
          horas10: result.horas10,
          horas11: result.horas11,
          horas12: result.horas12,
          horas13: result.horas13,
          horas14: result.horas14,
          horas15: result.horas15,
          horas16: result.horas16,
          horas17: result.horas17,
          nameId: {
            id: result.name_id,
            name: result.name,
            ocupado: result.ocupado,
            pausa: result.pausa,
            analise: result.analise
          }
        }
        this.nodemcuService.postRealizado(body2).subscribe(res => {
          console.log(res)
        })
      }
    })
  }

  saveDataProgramacao(data: Programacao[]) {

    data.forEach((item) => {
      const date1 = new Date(item.date);
      this.resultadoGeral.forEach((item2) => {
        const date2 = new Date(item2.data);

        if (
          date1.getDate() === date2.getDate() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getFullYear() === date2.getFullYear()
        ) {
          if(item.previsto != item2.imposto || item.realizado != item2.realizado || item.modelo != item2.modelo){
            console.log(item);
            var body: ResultadoGeral = {
              id: item2.id,
              imposto: item.previsto,
              realizado: item.realizado,
              data: item2.data,
              modelo: item.modelo
            }
            this.relatorioService.postGeral(body).subscribe(res => {
              this.openSnackBar("Salvo com sucesso");
            }, error => {
              this.openSnackBar(`Ocorrou um erro ao salvar ${error}`);
            })
          }
        }
      });
    });
  }


}
function provideMomentDateAdapter(MY_FORMATS: { parse: { dateInput: string; }; display: { dateInput: string; monthYearLabel: string; dateA11yLabel: string; monthYearA11yLabel: string; }; }): import("@angular/core").Provider {
  throw new Error('Function not implemented.');
}

