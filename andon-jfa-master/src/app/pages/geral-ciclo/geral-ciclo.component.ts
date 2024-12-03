import { timer } from 'rxjs';
import { MainService } from 'src/app/service/main.service';
import Chart from 'chart.js/auto';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Operation } from 'src/app/module/operation';
import { Ciclo } from 'src/app/module/relatorio/ciclo';
import { NodemcuService } from 'src/app/service/nodemcu.service';
import { RelatorioService } from 'src/app/service/relatorio.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-geral-ciclo',
  templateUrl: './geral-ciclo.component.html',
  styleUrls: ['./geral-ciclo.component.scss'],
})
export class GeralCicloComponent implements OnInit, AfterViewInit {
  selectedValue!: String;
  operation: Operation[] = [];
  selectFormControl = new FormControl('', Validators.required);
  ciclo: Ciclo[] = [];
  displayedColumns: string[] = ['op', 'count', 'time', 'data'];
  public MyChart: any;
  public MyChartMedia: any;

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(
      new Date(
        `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
          new Date().getDate()
        }`
      )
    ),
    end: new FormControl<Date | null>(
      new Date(
        `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
          new Date().getDate()
        }`
      )
    ),
  });
  dataTime: number[] = [];
  labels: string[] = [];
  dataTimeAverage: number[] = [];
  timeMeta: number = 0;
  dataTimeMeta: number[] = [];
  dataDispersal: number[] = [];
  dispersal: number = 0;
  dispersalPercentage: number = 0;
  coeficienteDeVariacao: number = 0;

  constructor(
    private relatorioService: RelatorioService,
    private nodemcuService: NodemcuService,
    private mainService: MainService
  ) {}

  ngOnInit(): void {
    this.mainService.getAllMain().subscribe((res) => {
      this.timeMeta = res[0].tcimposto;
    });
    this.nodemcuService.getAllOperation().subscribe((res) => {
      this.operation = res;
      setTimeout(() => {
        this.selectedValue = res[0].name
        this.getGeralCicloByDate(
          res[0].name,
          `${this.range.value.start!.getFullYear()}-${
            this.range.value.start!.getMonth() + 1
          }-${this.range.value.start!.getDate()}`,
          `${this.range.value.end!.getFullYear()}-${
            this.range.value.end!.getMonth() + 1
          }-${this.range.value.end!.getDate() + 1}`
        );
      }, 100);
    });

    this.selectFormControl.valueChanges.subscribe((value) => {
      this.getCicloByName(this.selectFormControl.value!);
    });

    this.range.valueChanges.subscribe((val) => {
      if (val.start != null && val.end != null) {
        this.getGeralCicloByDate(
          this.selectFormControl.value!,
          `${val.start.getFullYear()}-${
            val.start.getMonth() + 1
          }-${val.start.getDate()}`,
          `${val.end.getFullYear()}-${val.end.getMonth() + 1}-${
            val.end.getDate() + 1
          }`
        );
      }
    });
  }

  ngAfterViewInit(): void {}

  calcularDispersao(dados: number[]): number {
    if (dados.length === 0) {
      return 0; // Retorna 0 para arrays vazios
    }

    const media = dados.reduce((acc, val) => acc + val, 0) / dados.length;
    let somaDosQuadradosDasDiferencas = 0;

    dados.forEach((valor) => {
      somaDosQuadradosDasDiferencas += Math.pow(valor - media, 2);
    });

    return Math.sqrt(somaDosQuadradosDasDiferencas / dados.length);
  }

  calcularMedia(arr: number[]): number {
    if (!arr || arr.length === 0) {
      return 0;
    }
    return arr.reduce((acc, val) => acc + val, 0) / arr.length;
  }

  getCicloByName(name: string) {
    this.getGeralCicloByDate(
      name,
      `${this.range.value.start!.getFullYear()}-${
        this.range.value.start!.getMonth() + 1
      }-${this.range.value.start!.getDate()}`,
      `${this.range.value.end!.getFullYear()}-${
        this.range.value.end!.getMonth() + 1
      }-${this.range.value.end!.getDate() + 1}`
    );
  }

  getGeralCicloByDate(name: string, startedDate: string, endDate: string) {
    this.ciclo = [];
    this.labels = [];
    this.dataTime = [];
    this.relatorioService
      .getGeralCicloByDate(startedDate, endDate, name)
      .subscribe({
        next: (res) => {
          this.ciclo = res;
          this.ciclo.forEach((item) => {
            this.labels.push(new Date(item.data).toLocaleString());
            this.dataTime.push(item.time);
            const soma = this.dataTime.reduce(
              (acumulador, valorAtual) => acumulador + valorAtual,
              0
            );
            this.dataTimeAverage.push(soma / this.dataTime.length);
            this.dataTimeMeta.push(this.timeMeta);
            this.dispersal = this.calcularDispersao(this.dataTime);

            // Calcula o coeficiente de variação (CV) - uma medida de dispersão relativa
            this.coeficienteDeVariacao =
              (this.dispersal / this.calcularMedia(this.dataTime)) * 100;
          });

          setTimeout(() => {
            this.createChart();
          }, 100);
        },
      });
  }

  exportToExcel(): void {
    const dataToExport = this.ciclo.map((ciclo) => ({
      OP: ciclo.nameId.name,
      Contagem: ciclo.count,
      'Tempo Contado': ciclo.time,
      Data: new Date(ciclo.data).toLocaleString(),
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${this.selectFormControl.value}`);
    XLSX.writeFile(
      wb,
      `${this.selectFormControl.value}_${new Date()
        .toLocaleDateString()
        .replace('/', '-')}.xlsx`
    );
  }

  createChart() {
    if (this.MyChart) {
      this.MyChart.destroy();
    }
    this.MyChart = new Chart('MyChart', {
      data: {
        labels: this.labels,
        datasets: [
          {
            type: 'line',
            label: 'Tempo',
            data: this.dataTime,
            borderWidth: 2, // Linha mais grossa
            pointRadius: 0, // Pontos mais visíveis
            tension: 0.4, // Curva mais suave (opcional)
            fill: false, // Mantém a linha sem preenchimento
            borderColor: 'rgb(54, 162, 235)',
          },
          {
            type: 'line',
            label: 'Média',
            data: this.dataTimeAverage,
            borderWidth: 2, // Linha mais grossa
            pointRadius: 0, // Pontos mais visíveis
            tension: 0.4, // Curva mais suave (opcional)
            fill: false, // Mantém a linha sem preenchimento
            borderColor: 'rgb(255, 159, 64)',
          },          {
            type: 'line',
            label: 'Média Meta',
            data: this.dataTimeMeta,
            borderWidth: 2, // Linha mais grossa
            pointRadius: 0, // Pontos mais visíveis
            tension: 0.4, // Curva mais suave (opcional)
            fill: false, // Mantém a linha sem preenchimento
            borderColor: 'rgb(255, 99, 132)',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        onClick: (event, elements, chart) => {
          elements[0].index;
        },
      },
    });

  }
}
