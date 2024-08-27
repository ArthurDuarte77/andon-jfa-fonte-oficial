import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Chart from 'chart.js/auto';
import { Nodemcu } from 'src/app/module/nodemcu';
import { Realizado } from 'src/app/module/realizado';
import { RealizadoGeral } from 'src/app/module/realizadoGeral';
import { ResultadoGeral } from 'src/app/module/resultadoGeral';
import { MainService } from 'src/app/service/main.service';
import { NodemcuService } from 'src/app/service/nodemcu.service';


interface AnalysisResult {
  id?: number;
  status: string;
  reason: string[];
}


@Component({
  selector: 'app-controle-geral',
  templateUrl: './controle-geral.component.html',
  styleUrls: ['./controle-geral.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})


export class ControleGeralComponent implements OnInit {

  constructor(private nodemcuService: NodemcuService, private mainService: MainService) { }


  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  public MyChart: any;
  public MyChartModelos: any;
  public MyChartRealizado: any;
  public MyChartRealizadoTotal: any;
  public MyChartMediaTc: any;
  public MyChartTimeExcess: any;
  public MyChartTcExcedido: any;
  resultadoGeral: ResultadoGeral[] = [];
  dataImposto: number[] = [];
  dataTcImpostado: number[] = []
  dataRealizado: any[] = [];
  data: string[] = [];
  controleRealizado: RealizadoGeral[] = [];
  realizado: Realizado[] = [];
  dataImpostoRealizado: number[] = [];
  realizadoData: number[] = [];
  nodemcu: Nodemcu[] = []
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
  filteredData: Nodemcu[] = []
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
  dadosAnalizados: AnalysisResult[] = []

  ngOnInit(): void {
    this.getData(new Date().getMonth())

    this.nodemcuService.getAll().subscribe((res) => {
      this.nodemcu = res;
      this.dadosAnalizados = this.analyzeData(res)
      this.nodemcu.forEach(item => {
        this.tcMedio.push(item.tcmedio)
        this.time_excess.push(item.time_excess)
        this.analise.push(item.analise)
        this.ausencia.push(item.ajuda)
        this.interrupcoes.push(item.time_excess)
        this.tempoContadoExcedido.push(item.qtdeTCexcedido)
      })
      this.filteredData = [...this.nodemcu];
      this.mainService.getAllMain().subscribe(res => {

        for (let i = 0; i < this.nodemcu.length; i++) {
          this.dataImpostoRealizado.push((res[0].imposto / 8.66))
          this.dataTcImpostado.push((res[0].tcimposto))
        }
        this.TCimpostado = res[0].tcimposto
      })
      this.mainService.getAllRealizado().subscribe(res => {
        this.realizado = res;
        var horas7 = 0
        var horas8 = 0
        var horas9 = 0
        var horas10 = 0
        var horas11 = 0
        var horas12 = 0
        var horas13 = 0
        var horas14 = 0
        var horas15 = 0
        var horas16 = 0
        var horas17 = 0
        this.realizado.forEach(item => {
          if (item.nameId.name == "160") {
            horas7 += item.horas7;
            horas8 += item.horas8;
            horas9 += item.horas9;
            horas10 += item.horas10;
            horas11 += item.horas11;
            horas12 += item.horas12;
            horas13 += item.horas13;
            horas14 += item.horas14;
            horas15 += item.horas15;
            horas16 += item.horas16;
            horas17 += item.horas17;
          }

          const horas = [
            item.horas7,
            item.horas8,
            item.horas9,
            item.horas10,
            item.horas11,
            item.horas12,
            item.horas13,
            item.horas14,
            item.horas15,
            item.horas16
          ];

          const horasFiltradas = horas.filter(hora => hora !== 0);

          if (horasFiltradas.length > 0) {
            this.dataRealizadoTotal.push(horasFiltradas);
            this.dateRealizadoTotal.push(parseInt(item.nameId.name!));
          }

        });
        this.realizadoData.push(horas7, horas8, horas9, horas10, horas11, horas12, horas13, horas14, horas15, horas16)
        var hours: string[] = ["horas 7", "horas 8", "horas 9", "horas 10", "horas 11", "horas 12", "horas 13", "horas 14", "horas 15", "horas 16"]
        this.worstHour = hours[this.realizadoData.indexOf(Math.min(...this.realizadoData.filter(item => item > 0).slice(0, -1)))];
        this.bestHour = hours[this.realizadoData.indexOf(Math.max(...this.realizadoData.filter(item => item > 0).slice(0, -1)))];
        const sums: number[] = this.dataRealizadoTotal.map(subArray => subArray.reduce((acc: any, num: any) => acc + num, 0));
        this.worstOp = this.dateRealizadoTotal[sums.indexOf(Math.min(...sums))]
        this.bestOp = this.dateRealizadoTotal[sums.indexOf(Math.max(...sums))]
        this.worstTcOp = this.dateRealizadoTotal[this.tcMedio.indexOf(Math.max(...this.tcMedio))]
        this.bestTcOp = this.dateRealizadoTotal[this.tcMedio.indexOf(Math.min(...this.tcMedio))]
        this.bestTimeExcessOp = this.dateRealizadoTotal[this.time_excess.indexOf(Math.min(...this.time_excess))]
        this.worstTimeExcessOp = this.dateRealizadoTotal[this.time_excess.indexOf(Math.max(...this.time_excess))]
        this.createChartRealizadoTotal()
        this.createChartRealizado();
        this.createChartMediaTC();
        this.createChartTimeExcess("Qtde Tempo Excedido");
        this.createChartTempoContadoExcedido()
      });
    })



  }

  trackByMonth(index: number, month: string): string {
    return month;
  }

  analyzeData(data: Nodemcu[]): AnalysisResult[] {
    return data.map(item => {
      let status = "Bom";
      let reasons: string[] = [];

      if (item.state === "vermelho") {
        status = "Ruim";
        reasons.push("Estado vermelho");
      } else if (item.state === "piscar") {
        status = "Ruim";
        reasons.push("Estado piscando");
      }

      // if (item.qtdeTCexcedido > 50) {
      //   status = "Ruim";
      //   reasons.push("Quantidade de TCs excedidos muito alta");
      // }

      // if (item.time_excess > 30) {
      //   status = "Ruim";
      //   reasons.push("Excesso de tempo elevado");
      // }

      // if (item.ajuda > 3) {
      //   status = "Ruim";
      //   reasons.push("Número de ajudas alto");
      // }

      if (!item.contador.is_couting) {
        status = "Ruim";
        reasons.push("Contador não está contando");
      }

      if (item.currentTC > item.tcmedio) {
        status = "Ruim";
        reasons.push("Tempo atual de ciclo maior que o tempo médio de ciclo");
      }

      return {
        id: item.id,
        status,
        reason: reasons
      };
    });
  }
  getInterrupcoes(interrupcao: string) {
    if (interrupcao == "Análise") {
      this.interrupcoes = this.analise
    } else if (interrupcao == "Ausência") {
      this.interrupcoes = this.ausencia
    } else {
      this.interrupcoes = this.time_excess
    }
    if (this.MyChartTimeExcess) {
      this.MyChartTimeExcess.destroy();
    }
    this.createChartTimeExcess(interrupcao)

  }


  getData(month: number) {
    this.data = [];
    this.dataImposto = [];
    this.dataRealizado = [];
    this.modelos = [];
    this.realizadoModelos = [];
    this.totalImposto = 0;
    this.totalRealizado = 0;

    this.nodemcuService.getAllResultadoGeral().subscribe(res => {
      this.resultadoGeral = res;
      const currentDate = new Date();
      const currentMonth = month;
      const currentYear = currentDate.getFullYear();

      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dayOfWeek = date.getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          this.data.push(date.toLocaleDateString());
          this.dataImposto.push(0);
          this.dataRealizado.push(0);
        }
      }

      this.resultadoGeral.forEach((item) => {
        const itemDate = new Date(item.data).toLocaleDateString();

        if (this.data.includes(itemDate)) {
          const index = this.modelos.indexOf(item.modelo);
          if (index === -1) {
            this.modelos.push(item.modelo);
            this.realizadoModelos.push(item.realizado || 0);
          } else {
            this.realizadoModelos[index] = (this.realizadoModelos[index] || 0) + item.realizado;
          }
        }
      });

      if (this.MyChartModelos) {
        this.MyChartModelos.destroy();
      }
      this.createChartModelos();

      this.resultadoGeral.forEach(item => {
        for (let i = 0; i < this.data.length; i++) {
          if (this.data[i] === new Date(item.data).toLocaleDateString()) {
            this.dataImposto[i] = item.imposto;
            this.dataRealizado[i] = item.realizado;
            this.totalImposto += item.imposto;
            this.totalRealizado += item.realizado;
          }
        }
      });

      // Destruir o gráfico anterior se existir
      if (this.MyChart) {
        this.MyChart.destroy();
      }
      this.createChart();
    });
  }


  createChart() {
    this.MyChart = new Chart("MyChart", {
      data: {
        labels: this.data,
        datasets: [
          {
            type: 'line',
            label: "Previsto",
            data: this.dataImposto,
            fill: false,
            borderColor: 'orange'
          },
          {
            type: 'bar',
            label: "Realizado",
            data: this.dataRealizado,
            backgroundColor: '#11548F'
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
  }

  createChartModelos() {
    this.MyChartModelos = new Chart("MyChartModelos", {
      data: {
        labels: this.modelos,
        datasets: [
          {
            type: 'bar',
            label: "Realizado",
            data: this.realizadoModelos,
            backgroundColor: '#11548F'
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
  }

  createChartRealizado() {
    this.MyChartRealizado = new Chart("MyChartRealizado", {
      data: {
        labels: ["horas 7", "horas 8", "horas 9", "horas 10", "horas 11", "horas 12", "horas 13", "horas 14", "horas 15", "horas 16"],
        datasets: [
          {
            type: 'line',
            label: "Previsto",
            data: this.dataImpostoRealizado,
            fill: false,
            borderColor: 'orange'
          },
          {
            type: 'bar',
            label: "Realizado",
            data: this.realizadoData,
            backgroundColor: '#11548F'
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
  }

  createChartMediaTC() {
    this.MyChartMediaTc = new Chart("MyChartMediaTc", {
      data: {
        labels: this.dateRealizadoTotal,
        datasets: [
          {
            type: 'line',
            label: "Previsto",
            data: this.dataTcImpostado,
            fill: false,
            borderColor: 'orange'
          },
          {
            type: 'bar',
            label: "TC Médio",
            data: this.tcMedio,
            backgroundColor: '#11548F'
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
  }

  createChartTimeExcess(title: string) {
    this.MyChartTimeExcess = new Chart("MyChartTimeExcess", {
      data: {
        labels: this.dateRealizadoTotal,
        datasets: [
          {
            type: 'bar',
            label: title,
            data: this.interrupcoes,
            backgroundColor: '#11548F'
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
  }

  createChartTempoContadoExcedido() {
    this.MyChartTcExcedido = new Chart("MyChartTcExcedido", {
      data: {
        labels: this.dateRealizadoTotal,
        datasets: [
          {
            type: 'bar',
            label: "Qtde Tempo Contado Excedido",
            data: this.tempoContadoExcedido,
            backgroundColor: '#11548F'
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
  }

  createChartRealizadoTotal() {
    const colors = [
      '#4E79A7',  // Azul Escuro
      '#F28E2B',  // Laranja Suave
      '#E15759',  // Vermelho Suave
      '#76B7B2',  // Verde Água
      '#59A14F',  // Verde Escuro
      '#EDC948',  // Amarelo Suave
      '#B07AA1',  // Roxo
      '#FF9DA7',  // Rosa Suave
      '#9C755F',  // Marrom
      '#BAB0AC'   // Cinza
    ];


    this.MyChartRealizadoTotal = new Chart("MyChartRealizadoTotal", {
      type: 'bar',
      data: {
        labels: this.dateRealizadoTotal,
        datasets: this.dataRealizadoTotal[0].map((_: any, index: number) => (
          {
            label: `Hora ${index + 7}`,
            data: this.dataRealizadoTotal.map(hours => hours[index]),
            backgroundColor: colors[index]

          }))

      },
      options: {
        aspectRatio: 2.5,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

}

