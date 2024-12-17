import { MainService } from './../../service/main.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Modelo } from 'src/app/module/modelo';
import { ModeloService } from 'src/app/service/modelo.service';

@Component({
  selector: 'app-dialog-meta',
  templateUrl: './dialog-meta.component.html',
  styleUrls: ['./dialog-meta.component.scss']
})
export class DialogMetaComponent implements OnInit {

  constructor(private modeloService: ModeloService, private mainService: MainService) { }

  modelos: Modelo[] = []
  modelControl = new FormControl('');
  input = new FormControl(0);
  op = new FormControl(0);
  selectedModel: any;

  ngOnInit(): void {
    this.modeloService.getAll().subscribe(res => {
      this.modelos = res;
      this.selectedModel = res.find(item => item.is_current == true)?.modelo
    })

    this.mainService.getAllMain().subscribe(res => {
      this.input.setValue(res[0].imposto)
      this.op.setValue(parseInt(res[0].op))
    })
  }

  changeIsCurrent(modelo: Modelo) {
    this.modelos.forEach(item => {
      if (item.is_current == true) {
        this.modeloService.changeIsCurrent(item.modelo, false)
      }
    })
    this.modeloService.changeIsCurrent(modelo.modelo, true)
  }

}
