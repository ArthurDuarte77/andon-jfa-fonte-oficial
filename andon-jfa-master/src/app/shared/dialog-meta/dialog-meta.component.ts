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

  constructor(private modeloService: ModeloService) { }

  modelos: Modelo[] = []
  modelControl = new FormControl('');
  input = new FormControl(0);
  op = new FormControl(0);

  ngOnInit(): void {
    this.modeloService.getAll().subscribe(res => {
      this.modelos = res;
    })
  }

  changeIsCurrent(modelo: Modelo) {
    this.modelos.forEach(item => {
      if (item.is_current == true) {
        this.modeloService.changeIsCurrent(item.modelo, false) 
      }
    })
    console.log(modelo)
    this.modeloService.changeIsCurrent(modelo.modelo, true)
  }

}
