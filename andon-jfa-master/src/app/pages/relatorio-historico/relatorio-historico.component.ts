import { group } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Chart from 'chart.js/auto';
import { Nodemcu } from 'src/app/module/nodemcu';
import { Realizado } from 'src/app/module/realizado';
import { RealizadoGeral } from 'src/app/module/realizadoGeral';
import { Geral } from 'src/app/module/relatorio/geral';
import { GeralNodemcu } from 'src/app/module/relatorio/nodemcu';
import { GeralRealizadoHoraria } from 'src/app/module/relatorio/realizadoHoraria';
import { GeralRealizadoHorariaTablet } from 'src/app/module/relatorio/realizadoHorariaTablet';
import { ResultadoGeral } from 'src/app/module/resultadoGeral';
import { MainService } from 'src/app/service/main.service';
import { NodemcuService } from 'src/app/service/nodemcu.service';
import { RelatorioService } from 'src/app/service/relatorio.service';


interface dataNodemcu {
  data: number,
  count: number,
  firtlastTC: number,
  state: string,
  currentTC: number,
  analise: number,
  time_excess: number,
  maintenance: number,
  secondtlastTC: number,
  ajuda: number,
  thirdlastTC: number,
  shortestTC: number,
  qtdetcexcedido: number,
  tcmedio: number
}

interface NodemcuGeral {
  data: dataNodemcu[]
}

interface RealizadoHorariaTablet {
  nameId: {
    name: string;
  };
  horas7: RealizadoHoraria[];
  horas8: RealizadoHoraria[];
  horas9: RealizadoHoraria[];
  horas10: RealizadoHoraria[];
  horas11: RealizadoHoraria[];
  horas12: RealizadoHoraria[];
  horas13: RealizadoHoraria[];
  horas14: RealizadoHoraria[];
  horas15: RealizadoHoraria[];
  horas16: RealizadoHoraria[];
  horas17: RealizadoHoraria[];
}

interface RealizadoHoraria {
  data: Date,
  count: number
}

interface AnalysisResult {
  id?: number;
  status: string;
  reason: string[];
}

interface MediaTC {
  name: string[],
  media: number[]
}

@Component({
  selector: 'app-relatorio-historico',
  templateUrl: './relatorio-historico.component.html',
  styleUrls: ['./relatorio-historico.component.scss']
})
export class RelatorioHistoricoComponent implements OnInit {

  constructor(private relatorioService: RelatorioService) { }


  readonly range = new FormGroup({
    start: new FormControl<Date | null>(new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`)),
    end: new FormControl<Date | null>(new Date(`${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`)),
  });

  public MyChart: any;
  public MyChartModelos: any;
  public MyChartRealizadoHorariaTablet: any;
  public MyChartMediaTC: any;
  MyChartRealizadoHoraria: any;
  resultadoGeral: Geral[] = [];
  dataImposto: number[] = [];
  realizadoHoraria: GeralRealizadoHoraria[] = []
  nodemcu: GeralNodemcu[] = []
  realizadoHorariaTablet: RealizadoHorariaTablet | any;
  realizadoHorariaTabletKeys: string[] = [];
  dataRealizado: any[] = [];
  data: string[] = [];
  selectedEntry: string = "010"
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
  totalImposto: number = 0;
  modelos: String[] = []
  realizadoModelos: number[] = [];
  totalRealizado: number = 0;
  dataMediaTC: MediaTC = {
    name: [],
    media: []
  };
  curreantMonth: number = new Date().getMonth()

  ngOnInit(): void {
    this.getData(`${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`, `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`)
    this.range.valueChanges.subscribe(val => {
      if (val.start != null && val.end != null) {
        this.getData(`${val.start.getFullYear()}-${val.start.getMonth() + 1}-${val.start.getDate()}`, `${val.end.getFullYear()}-${val.end.getMonth() + 1}-${val.end.getDate()}`)
      }
    });
  }

  getAllRealizadoHoraria(start: string, end: string) {
    var startDate = `${new Date(start).getFullYear()}-${(new Date(start).getMonth() + 1).toString().padStart(2, '0')}-${new Date(start).getDate().toString().padStart(2, '0')}`;
    var endDate = `${new Date(end).getFullYear()}-${(new Date(end).getMonth() + 1).toString().padStart(2, '0')}-${(new Date(end).getDate() + 1).toString().padStart(2, '0')}`;
    this.relatorioService.getGeralRealizadoHoraria(startDate, endDate
    ).subscribe(res => {
      this.realizadoHoraria = res
      this.createChartRealizadoHoraria()
    })
  }

  getAllNodemcu(start: string, end: string) {
    var startDate = `${new Date(start).getFullYear()}-${(new Date(start).getMonth() + 1).toString().padStart(2, '0')}-${new Date(start).getDate().toString().padStart(2, '0')}`;
    var endDate = `${new Date(end).getFullYear()}-${(new Date(end).getMonth() + 1).toString().padStart(2, '0')}-${(new Date(end).getDate() + 1).toString().padStart(2, '0')}`;
    this.relatorioService.getGeralNodemcu(startDate, endDate
    ).subscribe(res => {
      const groupedData: Record<string, NodemcuGeral> = {};

      res.forEach(item => {
        const name = item.nameId.name;

        if (!groupedData[name]) {
          groupedData[name] = {
            data: []
          };
        }

        groupedData[name].data.push({
          data: item.data,
          count: item.count,
          firtlastTC: item.firtlastTC,
          state: item.state,
          currentTC: item.currentTC,
          analise: item.analise,
          time_excess: item.time_excess,
          maintenance: item.maintenance,
          secondtlastTC: item.secondtlastTC,
          ajuda: item.ajuda,
          thirdlastTC: item.thirdlastTC,
          shortestTC: item.shortestTC,
          qtdetcexcedido: item.qtdetcexcedido,
          tcmedio: item.tcmedio
        })
      })
      Object.keys(groupedData).forEach(name => {
        var tcmedio = 0
        groupedData[name].data.forEach(element => {
          tcmedio += element.tcmedio
        });
        this.dataMediaTC.name.push(name)
        this.dataMediaTC.media.push(parseInt((tcmedio / groupedData['010'].data.length).toFixed(2)))
      })
      this.createChartMediaTC()
    })
  }

  getAllRealizadoHorariaTablet(start: string, end: string) {
    var startDate = `${new Date(start).getFullYear()}-${(new Date(start).getMonth() + 1).toString().padStart(2, '0')}-${new Date(start).getDate().toString().padStart(2, '0')}`;
    var endDate = `${new Date(end).getFullYear()}-${(new Date(end).getMonth() + 1).toString().padStart(2, '0')}-${new Date(end).getDate().toString().padStart(2, '0')}`;
    this.relatorioService.getGeralRealizadoHorariaTablet(startDate, endDate).subscribe(res => {
      const groupedData: Record<string, RealizadoHorariaTablet> = {};

      res.forEach(item => {
        const name = item.nameId.name;

        if (!groupedData[name]) {
          groupedData[name] = {
            nameId: { name },
            horas7: [],
            horas8: [],
            horas9: [],
            horas10: [],
            horas11: [],
            horas12: [],
            horas13: [],
            horas14: [],
            horas15: [],
            horas16: [],
            horas17: []
          };
        }

        groupedData[name].horas7.push({
          data: new Date(item.data), count: item.horas7
        })
        groupedData[name].horas8.push({
          data: new Date(item.data), count: item.horas8,
        })
        groupedData[name].horas9.push({
          data: new Date(item.data), count: item.horas9,
        })
        groupedData[name].horas10.push({
          data: new Date(item.data), count: item.horas10,
        })
        groupedData[name].horas11.push({
          data: new Date(item.data), count: item.horas11,
        })
        groupedData[name].horas12.push({
          data: new Date(item.data), count: item.horas12,
        })
        groupedData[name].horas13.push({
          data: new Date(item.data), count: item.horas13,
        })
        groupedData[name].horas14.push({
          data: new Date(item.data), count: item.horas14,
        })
        groupedData[name].horas15.push({
          data: new Date(item.data), count: item.horas15,
        })
        groupedData[name].horas16.push({
          data: new Date(item.data), count: item.horas16,
        })
        groupedData[name].horas17.push({
          data: new Date(item.data), count: item.horas17,
        })
      });

      this.realizadoHorariaTablet = groupedData
      this.realizadoHorariaTabletKeys = Object.keys(this.realizadoHorariaTablet)
      this.createChartRealizadoHorariaTablet("010")

    })
  }


  getData(start: string, end: string) {
    this.getAllRealizadoHorariaTablet(start, end)
    this.getAllRealizadoHoraria(start, end)
    this.getAllNodemcu(start, end)
    this.data = [];
    this.dataImposto = [];
    this.dataRealizado = [];
    this.modelos = [];
    this.realizadoModelos = [];
    this.totalImposto = 0;
    this.totalRealizado = 0;

    this.relatorioService.getGeral(start, end).subscribe(res => {
      this.resultadoGeral = res;

      this.resultadoGeral.forEach((item) => {
        this.data.push(new Date(item.data).toLocaleDateString())
        this.dataImposto.push(item.imposto)
        this.dataRealizado.push(item.realizado)
        const index = this.modelos.indexOf(item.modelo);
        if (index === -1) {
          this.modelos.push(item.modelo);
          this.realizadoModelos.push(item.realizado || 0);
        } else {
          this.
            realizadoModelos[index] = (this.realizadoModelos[index] || 0) + item.realizado;
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
        aspectRatio: 2.5,
        onClick: (event, elements, chart) => {
          elements[0].index
        }
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

  createChartMediaTC() {

    if (this.MyChartMediaTC) {
      this.MyChartMediaTC.destroy();
    }

    this.MyChartMediaTC = new Chart("MyChartMediaTC", {
      data: {
        labels: this.dataMediaTC.name,
        datasets: [
          {
            type: 'bar',
            label: "Realizado",
            data: this.dataMediaTC.media,
            backgroundColor: '#11548F'
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }
    });
  }

  createChartRealizadoHoraria() {
    const colors = [
      '#336699',  // Azul Médio
      '#6699CC',  // Azul Claro
      '#99CCFF',  // Azul Pastel
      '#2F4F4F',  // Cinza Escuro
      '#708090',  // Cinza Médio
      '#A9A9A9',  // Cinza Claro
      '#006666',  // Verde Azulado Escuro
      '#66CCCC',  // Verde Azulado Claro
      '#4C4C4C',  // Cinza Grafite
      '#C0C0C0'   // Cinza Prata
    ];
    if (this.MyChartRealizadoHoraria) {
      this.MyChartRealizadoHoraria.destroy();
    }
    this.MyChartRealizadoHoraria = new Chart("MyChartRealizadoHoraria", {
      type: 'bar',
      data: {
        labels: ['7h', '8h', '9h', '10h', '11h', '13h', '14h', '15h', '16h'],
        datasets: this.realizadoHoraria.map((item: any, index: number) => ({
          label: `Dia ${index + 1}`, // ou use new Date(item.data).toLocaleDateString() para datas
          data: [
            item.horas7, item.horas8, item.horas9, item.horas10, item.horas11, item.horas13, item.horas14, item.horas15, item.horas16
          ],
          backgroundColor: colors[index],
        }))
      },
      options: {
        aspectRatio: 2.5,
        scales: {
          // r: { // Configurações específicas para o gráfico de radar
          //   beginAtZero: true
          // }
        }
      }
    });
  }

  createChartRealizadoHorariaTablet(name: string) {
    // Verifica se há dados disponíveis
    if (this.realizadoHorariaTablet.length === 0) {
      console.error("Nenhum dado disponível para 'realizadoHorariaTablet'.");
      return;
    }

    // Itera sobre cada operação

    const dataset = this.realizadoHorariaTablet[name];

    // Extrai as datas e os dados de contagem para cada hora
    const labels = dataset.horas7.map((item: any) => new Date(item.data).toLocaleDateString());
    const datasets = [
      {
        label: 'Horas 7',
        data: dataset.horas7.map((item: any) => item.count),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        borderWidth: 5,
      },
      {
        label: 'Horas 8',
        data: dataset.horas8.map((item: any) => item.count),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: false,
        borderWidth: 5,
      },
      {
        label: 'Horas 9',
        data: dataset.horas9.map((item: any) => item.count),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        fill: false,
        borderWidth: 5,
      },
      {
        label: 'Horas 10',
        data: dataset.horas10.map((item: any) => item.count),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
        borderWidth: 5,
      },
      {
        label: 'Horas 11',
        data: dataset.horas11.map((item: any) => item.count),
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        fill: false,
        borderWidth: 5,
      },
      {
        label: 'Horas 12',
        data: dataset.horas12.map((item: any) => item.count),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        borderWidth: 5,
      },
      {
        label: 'Horas 13',
        data: dataset.horas13.map((item: any) => item.count),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: false,
        borderWidth: 5,
      },
      {
        label: 'Horas 14',
        data: dataset.horas14.map((item: any) => item.count),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        fill: false,
        borderWidth: 5,
      },
      {
        label: 'Horas 15',
        data: dataset.horas15.map((item: any) => item.count),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
        borderWidth: 5,
      },
      {
        label: 'Horas 16',
        data: dataset.horas16.map((item: any) => item.count),
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        fill: false,
        borderWidth: 5,
      },
    ];

    if (this.MyChartRealizadoHorariaTablet) {
      this.MyChartRealizadoHorariaTablet.destroy();
    }

    this.MyChartRealizadoHorariaTablet = new Chart(`MyChartRealizadoHorariaTablet`, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: `Realizado Horário Tablet - Operação 010`
          }
        },
        scales: {
          x: {
            type: 'category',
            labels: labels
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}