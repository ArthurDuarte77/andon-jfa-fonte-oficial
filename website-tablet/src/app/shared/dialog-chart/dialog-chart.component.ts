import Chart from 'chart.js/auto';
import { OperationService } from 'src/app/service/operation.service';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-chart',
  templateUrl: './dialog-chart.component.html',
  styleUrls: ['./dialog-chart.component.scss'],
})
export class DialogChartComponent implements OnInit {
  data = inject(MAT_DIALOG_DATA);
  public MyChart: any;
  dataTime: number[] = [];
  labels: string[] = [];

  constructor(private operationService: OperationService) {}

  ngOnInit(): void {
    this.operationService
      .getGeralCicloByDate(
        `${new Date().getFullYear()}-${
          new Date().getMonth() + 1
        }-${new Date().getDate()}`,
        `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${
          new Date().getDate() + 1
        }`,
        this.data.operation
      )
      .subscribe({
        next: (res) => {
          res.forEach((item) => {
            this.labels.push(new Date(item.data).toLocaleTimeString());
            this.dataTime.push(item.time);
          });
          setTimeout(() => {
            this.createChart();
          }, 100);
        },
      });
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
