import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { VideoShort } from 'src/app/module/relatorio/video';
import { RelatorioService } from 'src/app/service/relatorio.service';

@Component({
  selector: 'app-video-relatorio',
  templateUrl: './video-relatorio.component.html',
  styleUrls: ['./video-relatorio.component.scss']
})
export class VideoRelatorioComponent implements OnInit{

  constructor(private relatorioService:RelatorioService){}

  displayedColumns: string[] = ['op', 'data', 'horario'];
  dataSource: any;

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(new Date(`${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`)),
    end: new FormControl<Date | null>(new Date(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`)),
  });

  applyFilter(event: Event) {
    console.log(event)
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.getAllVideo(`${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`, `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`)
    this.range.valueChanges.subscribe(val => {
      if (val.start != null && val.end != null) {
        this.getAllVideo(`${val.start.getFullYear()}-${val.start.getMonth() + 1}-${val.start.getDate()}`, `${val.end.getFullYear()}-${val.end.getMonth() + 1}-${val.end.getDate()}`)
      }
    });
  }

  getAllVideo(start: string, end: string){
    var startDate = `${new Date(start).getFullYear()}-${(new Date(start).getMonth() + 1).toString().padStart(2, '0')}-${new Date(start).getDate().toString().padStart(2, '0')}`;
    var endDate = `${new Date(end).getFullYear()}-${(new Date(end).getMonth() + 1).toString().padStart(2, '0')}-${(new Date(end).getDate() + 1).toString().padStart(2, '0')}`;
    this.relatorioService.getGeralVideo(startDate, endDate).subscribe(res => {
      var data: VideoShort[] = []
      res.forEach(item => {
        	data.push({name: item.nameId.name, data: item.data, horario: item.horario})
      })
      this.dataSource = new MatTableDataSource(data);
    })
  }
  
}
