import { Component, OnInit, inject } from '@angular/core';
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
import { DialogAddComponent } from 'src/app/shared/dialog-add/dialog-add.component';

@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.scss']
})
export class ConfiguracaoComponent implements OnInit {

  dialog = inject(MatDialog);

  constructor(private nodemcuService: NodemcuService, private mainService: MainService, private modeloService: ModeloService, private _snackBar: MatSnackBar) { }

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

  }

  saveData(data: Nodemcu[]) {
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
            _couting: result.contando
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
          qtdeTCexcedido: result.qtdeTCexcedido,
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


}

