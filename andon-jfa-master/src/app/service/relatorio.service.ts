import { GeralRealizadoHorariaTablet } from './../module/relatorio/realizadoHorariaTablet';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GeralNodemcu } from '../module/relatorio/nodemcu';
import { GeralMain } from '../module/relatorio/main';
import { GeralRealizadoHoraria } from '../module/relatorio/realizadoHoraria';
import { ResultadoGeral } from '../module/resultadoGeral';
import { Geral } from '../module/relatorio/geral';
import { Video } from '../module/relatorio/video';
import { Reproducao } from '../module/relatorio/reproducao';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

  constructor(private http:HttpClient) { }

  getGeralNodemcu(startedDate: string, endDate: string): Observable<GeralNodemcu[]>{
    return this.http.get<GeralNodemcu[]>(environment.url + `geral/nodemcu/filterByDate?startDate=${startedDate}¨&endDate=${endDate}`)
  }

  getGeralMain(startedDate: string, endDate: string): Observable<GeralMain[]>{
    return this.http.get<GeralMain[]>(environment.url + `geral/main/filterByDate?startDate=${startedDate}¨&endDate=${endDate}`)
  }

  getGeralRealizadoHoraria(startedDate: string, endDate: string): Observable<GeralRealizadoHoraria[]>{
    return this.http.get<GeralRealizadoHoraria[]>(environment.url + `geral/realizadoHoraria/filterByDate?startDate=${startedDate}¨&endDate=${endDate}`)
  }

  getGeralRealizadoHorariaTablet(startedDate: string, endDate: string): Observable<GeralRealizadoHorariaTablet[]>{
    return this.http.get<GeralRealizadoHorariaTablet[]>(environment.url + `geral/realizadoHorariaTablet/filterByDate?startDate=${startedDate}&endDate=${endDate}`)
  }

  getGeral(startedDate: string, endDate: string): Observable<Geral[]>{
    return this.http.get<Geral[]>(environment.url + `geral/filterByDate?startDate=${startedDate}&endDate=${endDate}`)
  }

  postGeral(body: ResultadoGeral): Observable<ResultadoGeral>{
    return this.http.post<ResultadoGeral>(environment.url + 'geral', body)
  }

  getGeralVideo(start: string, end: string): Observable<Video[]>{
    return this.http.get<Video[]>(environment.url + `geral/video/filterByDate?startDate=${start}&endDate=${end}`)
  }

  getGeralReproducoes(): Observable<Reproducao[]>{
    return this.http.get<Reproducao[]>(environment.url + 'video')
  }
  

  updateGeral(){
    // return this.http.patch(environment.url)
  }


}
