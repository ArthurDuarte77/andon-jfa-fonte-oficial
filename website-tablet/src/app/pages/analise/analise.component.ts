import { Component, OnDestroy, OnInit } from '@angular/core';
import { Nodemcu } from 'src/app/model/nodemcu';
import { Operation } from 'src/app/model/operation/operation';
import { OperationService } from 'src/app/service/operation.service';

@Component({
  selector: 'app-analise',
  templateUrl: './analise.component.html',
  styleUrls: ['./analise.component.scss']
})
export class AnaliseComponent implements OnInit, OnDestroy{

  constructor(private service: OperationService) { }



  nodemcu: Operation[] = []
  intervalo: any;

  ngOnDestroy(): void {
    clearInterval(this.intervalo)
  }
  ngOnInit(): void {
    this.service.getAll().subscribe(res => {
      this.nodemcu = res
    })
    this.intervalo = setInterval(() => {
      this.service.getAll().subscribe(res => {
        this.nodemcu = res
      })
    }, 5000)
  }


  changeAnalise(item: Operation){
    this.service.changeAnalise(item.name, !item.analise)
  }

  enterFullscreen() {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  }
}
