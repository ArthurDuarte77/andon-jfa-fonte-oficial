import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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
  ciclo: Ciclo[] = []
  displayedColumns: string[] = ['op', 'count', 'time', 'data'];

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
          this.ciclo = res
        });
      }, 100);
    });

    this.selectFormControl.valueChanges.subscribe(value => {
      this.getCicloByName(this.selectFormControl.value!);
    })
  }

  ngAfterViewInit(): void {
  }



  getCicloByName(name: string) {
    this.relatorioService.getGeralCiclo(name).subscribe((res) => {
      this.ciclo = res
    });
  }

  exportToExcel(): void {
    const dataToExport = this.ciclo.map(ciclo => ({
      'OP': ciclo.nameId.name,
      'Contagem': ciclo.count,
      'Tempo Contado': ciclo.time,
      'Data': new Date(ciclo.data).toLocaleString()
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DadosCiclo');
    XLSX.writeFile(wb, 'dados_ciclo.xlsx');
  }
}
