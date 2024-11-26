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

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(
      new Date(
        `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
          new Date().getDate() + 1
        }`
      )
    ),
    end: new FormControl<Date | null>(
      new Date(
        `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
          new Date().getDate() + 1
        }`
      )
    ),
  });
  dataTime: number[] = [];
  labels: string[] = [];

  constructor(
    private relatorioService: RelatorioService,
    private nodemcuService: NodemcuService
  ) {}

  ngOnInit(): void {
    this.nodemcuService.getAllOperation().subscribe((res) => {
      this.operation = res;
      setTimeout(() => {
        this.relatorioService.getGeralCiclo(res[0].name).subscribe((res) => {
          this.selectedValue = res[0].nameId.name;
          this.ciclo = res;
          this.ciclo.forEach((item) => {
            this.labels.push(new Date(item.data).toLocaleString());
            this.dataTime.push(item.time);
          });
        });
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

  getCicloByName(name: string) {
    this.labels = [];
    this.dataTime = [];
    this.relatorioService
      .getGeralCicloByDate(
        `${this.range.value.start!.getFullYear()}-${
          this.range.value.start!.getMonth() + 1
        }-${this.range.value.start!.getDate()}`,
        `${this.range.value.end!.getFullYear()}-${
          this.range.value.end!.getMonth() + 1
        }-${this.range.value.end!.getDate() + 1}`,
        name
      )
      .subscribe({
        next: (res) => {
          this.ciclo = res;
          this.ciclo.forEach((item) => {
            this.labels.push(new Date(item.data).toLocaleString());
            this.dataTime.push(item.time);
          });
          setTimeout(() => {
            this.createChart();
          }, 100);
        },
      });
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
            fill: false,
            borderColor: 'orange',
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
