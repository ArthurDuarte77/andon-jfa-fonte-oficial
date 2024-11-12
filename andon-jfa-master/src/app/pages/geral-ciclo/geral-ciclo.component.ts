import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Operation } from 'src/app/module/operation';
import { Ciclo } from 'src/app/module/relatorio/ciclo';
import { NodemcuService } from 'src/app/service/nodemcu.service';
import { RelatorioService } from 'src/app/service/relatorio.service';

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
  displayedColumns: string[] = ['op', 'count', 'data'];

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
}
